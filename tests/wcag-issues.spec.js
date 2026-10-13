// WCAG 2.1 AA regression tests for the open issues in WCAG2-REPORT.md.
// Each test asserts the CORRECT, accessible behavior, so it fails while the
// issue is open and passes once it is fixed.
//
// Requires the dev server: `npm run dev` (http://localhost:5173)
// Run: npx playwright test tests/wcag-issues.spec.js --project=chromium --reporter=list

import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const BASE_URL = 'http://localhost:5173'

// ---------------------------------------------------------------------------
// Fixtures + API mocks (/api/tmdb/* is the serverless TMDB proxy)
// ---------------------------------------------------------------------------

const makeMovie = (id, title) => ({ id, title, poster_path: `/poster-${id}.jpg` })

const DISCOVER_RESULTS = {
	page: 1,
	total_pages: 3,
	results: [makeMovie(101, 'Interstellar'), makeMovie(102, 'Arrival'), makeMovie(103, 'Dune')],
}

const SEARCH_RESULTS = {
	page: 1,
	total_pages: 1,
	results: [makeMovie(201, 'Alien'), makeMovie(202, 'Aliens')],
}

const MOVIE_DETAIL = {
	id: 101,
	title: 'Interstellar',
	poster_path: '/poster-101.jpg',
	overview: 'A team of explorers travel through a wormhole in space.',
	release_date: '2014-11-05',
	runtime: 169,
	vote_average: 8.4,
	genres: [{ id: 12, name: 'Adventure' }, { id: 878, name: 'Science Fiction' }],
}

// 1x1 transparent PNG so poster requests never hit the network
const PNG_1PX = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
	'base64',
)

/**
 * Mocks every API route the app uses. Pass `hold` to delay a route until the
 * returned release function for it is called (used for loading-state tests).
 */
async function mockApi(page, { hold = [] } = {}) {
	const releases = {}
	const gate = (name) => {
		if (!hold.includes(name)) return Promise.resolve()
		return new Promise(resolve => { releases[name] = resolve })
	}

	await page.route('https://image.tmdb.org/**', route =>
		route.fulfill({ status: 200, contentType: 'image/png', body: PNG_1PX }))

	await page.route('**/api/tmdb/discover/movie**', async route => {
		await gate('discover')
		await route.fulfill({ json: DISCOVER_RESULTS })
	})
	await page.route('**/api/tmdb/search/movie**', async route => {
		await gate('search')
		await route.fulfill({ json: SEARCH_RESULTS })
	})
	await page.route(/\/api\/tmdb\/movie\/\d+/, async route => {
		await gate('detail')
		await route.fulfill({ json: MOVIE_DETAIL })
	})

	return {
		release: async (name) => {
			await expect.poll(() => typeof releases[name]).toBe('function')
			releases[name]()
		},
	}
}

async function gotoHome(page) {
	await page.goto(BASE_URL)
	await expect(page.getByRole('button', { name: 'View details for Interstellar' })).toBeVisible()
}

async function openDetails(page) {
	await page.getByRole('button', { name: 'View details for Interstellar' }).click()
	const dialog = page.getByRole('dialog', { name: 'Movie details' })
	await expect(dialog).toBeVisible()
	return dialog
}

/** Opens a filter accordion on desktop (accordions start collapsed). */
async function openAccordion(page, title) {
	const button = page.getByRole('button', { name: title, exact: true })
	if ((await button.getAttribute('aria-expanded')) !== 'true') await button.click()
}

/** Presses Tab until `locator` has focus, so :focus-visible applies as for a keyboard user. */
async function tabTo(page, locator, maxTabs = 60) {
	for (let i = 0; i < maxTabs; i++) {
		await page.keyboard.press('Tab')
		if (await locator.evaluate(el => el === document.activeElement)) return
	}
	throw new Error(`Could not reach element with Tab after ${maxTabs} presses`)
}

/** Computed focus-indicator styles for the focused element. */
const focusStyles = (locator) => locator.evaluate(el => {
	const cs = getComputedStyle(el)
	return {
		focusVisible: el.matches(':focus-visible'),
		outlineStyle: cs.outlineStyle,
		outlineWidth: parseFloat(cs.outlineWidth) || 0,
	}
})

async function expectVisibleFocusIndicator(locator) {
	const s = await focusStyles(locator)
	expect(s.focusVisible, 'element should match :focus-visible after keyboard focus').toBe(true)
	expect(s.outlineStyle, 'focus outline must not be removed').not.toBe('none')
	expect(s.outlineWidth, 'focus outline should be at least 2px').toBeGreaterThanOrEqual(2)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('ISSUE-01: RatingFilter is a single-select radio group (SC 1.3.1, 4.1.2)', { tag: '@ISSUE-01' }, () => {
	test('rating options are radios sharing one name inside a labelled group, with an "Any" option', async ({ page }) => {
		await mockApi(page)
		await gotoHome(page)
		await openAccordion(page, 'Rating')

		const panel = page.getByRole('region', { name: 'Rating' })
		await expect(panel.getByRole('checkbox'), 'single-select ratings must not be checkboxes').toHaveCount(0)

		const group = panel.getByRole('radiogroup', { name: /rating/i })
			.or(panel.getByRole('group', { name: /rating/i }))
		const radios = group.first().getByRole('radio')
		await expect(radios).toHaveCount(6) // Any, 5+, 6+, 7+, 8+, 9+
		await expect(group.first().getByRole('radio', { name: /any/i })).toBeVisible()

		const names = await radios.evaluateAll(els => [...new Set(els.map(el => el.getAttribute('name')))])
		expect(names, 'all rating radios share one non-empty name').toHaveLength(1)
		expect(names[0]).toBeTruthy()

		// Selecting one option exposes the exclusive relationship via radio state
		await group.first().getByRole('radio', { name: '8+' }).check()
		await group.first().getByRole('radio', { name: '7+' }).check()
		await expect(group.first().getByRole('radio', { name: '8+' })).not.toBeChecked()
	})
})

test.describe('ISSUE-02: CardDetails <dt> labels stay in the accessibility tree on mobile (SC 1.3.1)', { tag: '@ISSUE-02' }, () => {
	test.use({ viewport: { width: 375, height: 812 } })

	test('detail terms are exposed to assistive tech at 375px', async ({ page }) => {
		await mockApi(page)
		await gotoHome(page)
		const dialog = await openDetails(page)
		await expect(dialog.getByRole('heading', { name: 'Interstellar' })).toBeVisible()

		const terms = dialog.locator('dt')
		await expect(terms).toHaveCount(4)
		const styles = await terms.evaluateAll(els => els.map(el => {
			const cs = getComputedStyle(el)
			return { text: el.textContent.trim(), display: cs.display, visibility: cs.visibility }
		}))
		for (const s of styles) {
			expect(s.display, `"${s.text}" must not be display:none`).not.toBe('none')
			expect(s.visibility, `"${s.text}" must not be visibility:hidden`).not.toBe('hidden')
		}

		const snapshot = await dialog.locator('dl').ariaSnapshot()
		for (const label of ['Release date', 'Runtime', 'Rating', 'Genre']) {
			expect(snapshot, `accessibility tree should include "${label}"`).toContain(label)
		}
	})
})

test.describe('ISSUE-03: Inputs and dropdowns show a visible focus indicator (SC 2.4.7)', { tag: '@ISSUE-03' }, () => {
	test.beforeEach(async ({ page }) => {
		await mockApi(page)
		await gotoHome(page)
	})

	test('search input', async ({ page }) => {
		const input = page.getByRole('textbox', { name: 'Search movies' })
		await tabTo(page, input)
		await expectVisibleFocusIndicator(input)
	})

	test('sort dropdown', async ({ page }) => {
		const select = page.getByRole('combobox', { name: /sort by/i })
		await tabTo(page, select)
		await expectVisibleFocusIndicator(select)
	})

	test('year range number input', async ({ page }) => {
		await openAccordion(page, 'Year Range')
		const input = page.getByRole('spinbutton', { name: 'From' })
		await tabTo(page, input)
		await expectVisibleFocusIndicator(input)
	})
})

test.describe('ISSUE-04: Buttons show a visible focus indicator (SC 2.4.7)', { tag: '@ISSUE-04' }, () => {
	test.beforeEach(async ({ page }) => {
		await mockApi(page)
		await gotoHome(page)
	})

	test('search submit button', async ({ page }) => {
		const button = page.getByRole('button', { name: 'Search', exact: true })
		await tabTo(page, button)
		await expectVisibleFocusIndicator(button)
	})

	test('reset filters button', async ({ page }) => {
		await openAccordion(page, 'Genre')
		await page.getByRole('checkbox', { name: 'Action' }).check()
		const button = page.getByRole('button', { name: 'Reset Filters' })
		await expect(button).toBeVisible()
		await tabTo(page, button)
		await expectVisibleFocusIndicator(button)
	})

	test('clear search button', async ({ page }) => {
		const input = page.getByRole('textbox', { name: 'Search movies' })
		await input.fill('alien')
		await input.press('Enter')
		const button = page.getByRole('button', { name: 'Clear search' })
		await expect(button).toBeVisible()
		await page.locator('body').focus()
		await tabTo(page, button)
		await expectVisibleFocusIndicator(button)
	})
})

test.describe('ISSUE-05: Skip link is visibly styled when focused (SC 2.4.7, 2.4.1)', { tag: '@ISSUE-05' }, () => {
	test('first Tab reveals a visible, on-top, styled skip link', async ({ page }) => {
		await mockApi(page)
		await gotoHome(page)

		await page.keyboard.press('Tab')
		const link = page.getByRole('link', { name: 'Skip to main content' })
		await expect(link).toBeFocused()
		await expect(link).toBeInViewport()

		const info = await link.evaluate(el => {
			const r = el.getBoundingClientRect()
			const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
			const cs = getComputedStyle(el)
			return {
				onTop: top === el || el.contains(top),
				outlineStyle: cs.outlineStyle,
				outlineWidth: parseFloat(cs.outlineWidth) || 0,
				background: cs.backgroundColor,
				paddingTop: parseFloat(cs.paddingTop) || 0,
				paddingLeft: parseFloat(cs.paddingLeft) || 0,
				zIndex: cs.zIndex,
			}
		})
		expect.soft(info.onTop, 'skip link must not render behind other content').toBe(true)
		expect.soft(info.outlineStyle).not.toBe('none')
		expect.soft(info.outlineWidth).toBeGreaterThanOrEqual(2)
		expect.soft(info.background, 'skip link needs its own background').not.toMatch(/rgba\(0, 0, 0, 0\)|transparent/)
		expect.soft(info.paddingTop + info.paddingLeft, 'skip link needs padding').toBeGreaterThan(0)
		expect.soft(info.zIndex, 'skip link needs an explicit z-index').not.toBe('auto')

		await page.keyboard.press('Enter')
		await expect(page).toHaveURL(/#site-main$/)
	})
})

test.describe('ISSUE-06: "Overview" in CardDetails is a heading (SC 1.3.1, 2.4.6)', { tag: '@ISSUE-06' }, () => {
	test('Overview is an h3 under the h2 movie title', async ({ page }) => {
		await mockApi(page)
		await gotoHome(page)
		const dialog = await openDetails(page)

		await expect(dialog.getByRole('heading', { level: 2, name: 'Interstellar' })).toBeVisible()
		await expect(dialog.getByRole('heading', { level: 3, name: 'Overview' })).toBeVisible()
	})
})

test.describe('ISSUE-07: Result updates are announced via a persistent status region (SC 4.1.3)', { tag: '@ISSUE-07' }, () => {
	test('a status region announces the result count and survives search updates', async ({ page }) => {
		await mockApi(page)
		await gotoHome(page)

		const status = page.getByRole('status').filter({ hasText: /\b3\b.*(movie|result)/i })
		await expect(status, 'initial load should announce "3 movies found"').toHaveCount(1)
		const handle = await status.elementHandle()

		const input = page.getByRole('textbox', { name: 'Search movies' })
		await input.fill('alien')
		await input.press('Enter')
		await expect(page.getByRole('button', { name: 'View details for Alien', exact: true })).toBeVisible()

		expect(await handle.evaluate(el => el.isConnected), 'status region must persist across grid remounts').toBe(true)
		await expect.poll(() => handle.evaluate(el => el.textContent)).toMatch(/\b2\b.*(movie|result)/i)
	})
})

test.describe('ISSUE-08: Loading card list is marked busy and skeletons are hidden (SC 4.1.3)', { tag: '@ISSUE-08' }, () => {
	test('skeleton list has aria-busy="true" and each skeleton is aria-hidden', async ({ page }) => {
		const api = await mockApi(page, { hold: ['discover'] })
		await page.goto(BASE_URL)

		const list = page.locator('ul:has(.card-skeleton)')
		await expect(list).toBeVisible()
		await expect(list).toHaveAttribute('aria-busy', 'true')

		const hidden = await page.locator('.card-skeleton').evaluateAll(els =>
			els.map(el => el.closest('[aria-hidden="true"]') !== null))
		expect(hidden.length).toBeGreaterThan(0)
		expect(hidden.every(Boolean), 'every skeleton should be aria-hidden').toBe(true)

		await api.release('discover')
		await expect(page.getByRole('button', { name: 'View details for Interstellar' })).toBeVisible()
	})
})

test.describe('ISSUE-09: Detail skeleton is hidden and loading is announced (SC 1.3.1)', { tag: '@ISSUE-09' }, () => {
	test('CardDetailSkeleton is aria-hidden with a "Loading movie details" status', async ({ page }) => {
		const api = await mockApi(page, { hold: ['detail'] })
		await gotoHome(page)
		const dialog = await openDetails(page)

		const skeleton = dialog.locator('.card-details-skeleton')
		await expect(skeleton).toBeAttached()
		expect(await skeleton.evaluate(el => el.closest('[aria-hidden="true"]') !== null),
			'detail skeleton should be aria-hidden').toBe(true)
		await expect(dialog.getByRole('status')).toContainText(/loading movie details/i)

		await api.release('detail')
		await expect(dialog.getByRole('heading', { name: 'Interstellar' })).toBeVisible()
	})
})

test.describe('ISSUE-11: Year range inputs identify and describe errors (SC 3.3.1, 3.3.3)', { tag: '@ISSUE-11' }, () => {
	test.beforeEach(async ({ page }) => {
		await mockApi(page)
		await gotoHome(page)
		await openAccordion(page, 'Year Range')
	})

	async function expectDescribedError(page, input) {
		await expect(input).toHaveAttribute('aria-invalid', 'true')
		const describedBy = await input.getAttribute('aria-describedby')
		expect(describedBy, 'invalid input should reference an error via aria-describedby').toBeTruthy()
		const message = page.locator(describedBy.split(/\s+/).map(id => `[id="${id}"]`).join(', '))
		await expect(message.first()).toBeVisible()
		await expect(message.first()).not.toHaveText('')
	}

	test('out-of-range year (1800) is flagged with an error message', async ({ page }) => {
		const from = page.getByRole('spinbutton', { name: 'From' })
		await from.fill('1800')
		await expectDescribedError(page, from)
	})

	test('"From" later than "To" is flagged with an error message', async ({ page }) => {
		const from = page.getByRole('spinbutton', { name: 'From' })
		const to = page.getByRole('spinbutton', { name: 'To' })
		await from.fill('2020')
		await to.fill('2000')
		const invalid = page.locator('#year-from[aria-invalid="true"], #year-to[aria-invalid="true"]').first()
		await expectDescribedError(page, invalid)
	})
})

test.describe('axe baseline (WCAG 2.1 A/AA automated scan)', { tag: '@axe' }, () => {
	const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

	test('home page has no automated violations', async ({ page }) => {
		await mockApi(page)
		await gotoHome(page)
		const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
		expect(results.violations.map(v => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([])
	})

	test('movie details modal has no automated violations', async ({ page }) => {
		await mockApi(page)
		await gotoHome(page)
		const dialog = await openDetails(page)
		await expect(dialog.getByRole('heading', { name: 'Interstellar' })).toBeVisible()
		const results = await new AxeBuilder({ page }).include('dialog').withTags(TAGS).analyze()
		expect(results.violations.map(v => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([])
	})
})

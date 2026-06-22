// Props:
//	fallback (node, optional)
//	children (node)

import { Component } from 'react'

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	componentDidCatch(error, errorInfo) {
		console.error('Uncaught error:', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback ?? <p className='error-message'>Something went wrong. Please try again.</p>
		}

		return this.props.children
	}
}

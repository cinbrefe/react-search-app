import { Component } from 'react'

export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	render() {
		if (this.state.hasError) {
			return <p>Something went wrong. Please try again.</p>
		}
		return this.props.children
	}
}

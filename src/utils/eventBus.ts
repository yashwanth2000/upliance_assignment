type Callback = () => void;

class EventBus {
	private listeners: { [key: string]: Callback[] } = {};

	subscribe(event: string, callback: Callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
		return () => this.unsubscribe(event, callback);
	}

	emit(event: string) {
		if (this.listeners[event]) {
			this.listeners[event].forEach(callback => callback());
		}
	}

	private unsubscribe(event: string, callback: Callback) {
		if (this.listeners[event]) {
			this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
		}
	}
}

export const eventBus = new EventBus();
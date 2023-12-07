export default {
    jump: new KeyboardEvent('keydown', {key: 'Space', KeyCode: 32}),
    dispatch(event) {
        document.dispatchEvent(this[event]);
    }
}
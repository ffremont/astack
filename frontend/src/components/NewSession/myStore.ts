export const myStore = (name: string, value?: string): string | null => {
    if (value) {
        window.localStorage.setItem('astrobook.' + name, value)
    } else {
        return window.localStorage.getItem('astrobook.' + name) || null
    }

    return value || null
}

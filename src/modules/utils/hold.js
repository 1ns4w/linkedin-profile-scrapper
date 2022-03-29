export const hold = (seconds) => {
    return new Promise(r => setTimeout(r, seconds * 1000));
}
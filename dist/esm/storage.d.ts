export default class Storage {
    removeStorage: (name: string) => boolean;
    getStorage: (key: string) => string | null;
    setStorage: (key: string, value: string, expires?: number | null) => boolean;
}

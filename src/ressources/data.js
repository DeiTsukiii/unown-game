export function getData() {
    let data = window.localStorage.getItem('data')
    if (data === null) {
        data = {
            settings: {
                keys: {
                    leftKey: 'A',
                    rightKey: 'D',
                    upKey: 'W',
                    downKey: 'S'
                },
                language: 'fr-FR',
                Music: true,
                WASD: true,
                "Fast text\nflow": false
            },
            player: {
                gender: undefined, // M / F
                name: undefined
            },
            step: 0
        }
        data = JSON.stringify(data)
        window.localStorage.setItem('data', data);
    }
    data = JSON.parse(data);
    return data;
}

export function saveData(data) {
    data = JSON.stringify(data);
    window.localStorage.setItem('data', data);
}
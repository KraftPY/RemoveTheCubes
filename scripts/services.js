export function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function getRandomColor() {
    let r = 0;
    let g = 0;
    let b = 0;

    // choose random color, but not too light
    do {
        r = getRandom(0, 255);
        g = getRandom(0, 255);
        b = getRandom(0, 255);
    } while (r + g + b > 680);

    return `rgb(${r}, ${g}, ${b})`;
}

export function getRandomPosition(parent, cubeSize) {
    const fieldHeight = parent.clientHeight;
    const fieldWidth = parent.clientWidth;

    return {
        top: getRandom(0, fieldHeight - cubeSize),
        left: getRandom(0, fieldWidth - cubeSize)
    }
}

export function checkUniquePosition(arrCubes, newSize, newPos) {
    return arrCubes.find(cube => {
        switch (true) {
            case (cube.props.left <= newPos.left) && (cube.props.left + cube.props.size >= newPos.left) &&
                (cube.props.top <= newPos.top) && (cube.props.top + cube.props.size >= newPos.top):
                return true;
            case (cube.props.left <= newPos.left + newSize) && (cube.props.left + cube.props.size >= newPos.left + newSize) &&
                (cube.props.top <= newPos.top) && (cube.props.top + cube.props.size >= newPos.top):
                return true;
            case (cube.props.left < newPos.left) && (cube.props.left + cube.props.size >= newPos.left) &&
                (cube.props.top < newPos.top + newSize) && (cube.props.top + cube.props.size >= newPos.top + newSize):
                return true;
            case (cube.props.left <= newPos.left + newSize) && (cube.props.left + cube.props.size >= newPos.left + newSize) &&
                (cube.props.top <= newPos.top + newSize) && (cube.props.top + cube.props.size >= newPos.top + newSize):
                return true;
            case (newPos.left <= cube.props.left) && (newPos.left + newSize >= cube.props.left) &&
                (newPos.top <= cube.props.top) && (newPos.top + newSize >= cube.props.top):
                return true;
            case (newPos.left <= cube.props.left + cube.props.size) && (newPos.left + newSize >= cube.props.left + cube.props.size) &&
                (newPos.top <= cube.props.top) && (newPos.top + newSize >= cube.props.top):
                return true;
            case (newPos.left <= cube.props.left) && (newPos.left + newSize >= cube.props.left) &&
                (newPos.top <= cube.props.top + cube.props.size) && (newPos.top + newSize >= cube.props.top + cube.props.size):
                return true;
            case (newPos.left <= cube.props.left + cube.props.size) && (newPos.left + newSize >= cube.props.left + cube.props.size) &&
                (newPos.top <= cube.props.top + cube.props.size) && (newPos.top + newSize >= cube.props.top + cube.props.size):
                return true;
            default:
                break;
        }
    });
}

export function secondsToString(sec) {
    let mm = Math.trunc(sec / 60);
    let ss = sec % 60;
    mm = (mm < 10) ? '0' + mm : mm;
    ss = (ss < 10) ? '0' + ss : ss;
    return `${mm}:${ss}`;
}
const sleep = async (delay = DEFAULT_SLEEP, description = '') => {
    return new Promise(resolve => {
        console.log(`sleep ${delay} ms ${description}`);
        setTimeout(() => resolve(), delay);
    });
};

const scrollDown = () => {
    window.scrollTo(0, document.body.scrollHeight);
};
const MAX_PHOTOS = 35;
const photoSelector = 'a[href^="/p/"]';

let processedPhotos = [];

const getPhotosUrls = photoEls => {
    const urls = [];
    photoEls.forEach(el => {
        const href = el.getAttribute('href');
        urls.push(href);
    });
    return urls;
};

const getUnprocessedPhotos = (newUrlsList = []) => {
    const result = [];
    newUrlsList.forEach(url => {
        if (processedPhotos.indexOf(url) === -1) {
            result.push(url);
        } 
    });
    return result;
};

const openPhotoViewer = href => {
    const photoEl = document.querySelector(`a[href="${href}"]`);
    if (photoEl) {
        photoEl.click();
        console.log(`click on photo ${href}`);
    } else {
        reject();
    }
};

const closePhotoViewer = () => {
    const closeButton = document.querySelector('div.Igw0E > button.wpO6b');
    closeButton.click();
};

const likePhoto = () => {
    try {
        const likeBtn = document.querySelector('section.ltpMr > span.fr66n > button.wpO6b');
        const iconLikeBtn = likeBtn.querySelector('svg[aria-label="Нравится"]');
        if (iconLikeBtn) {
            likeBtn.click();
        }
    } catch (error) {
        console.log('%cerror like', 'color: orange');
    }
};

const likePhotos = async nextPhotoUrls => {
    return new Promise(resolve => {
        const photosUrls = getUnprocessedPhotos(nextPhotoUrls);
        console.log(`%clocal session: ${photosUrls.join(', ')}, count: ${photosUrls.length}`, 'color: forestgreen');

        const iterator = function* () {
            yield* photosUrls;
        };

        const it = iterator();

        const likeNext = async () => {
            const { value: url, done } = it.next();
            if (!done) {
                console.log(`like ${url}...`);

                processedPhotos.push(url);

                openPhotoViewer(url);
                await sleep(1000, 'delay before like');

                likePhoto();
                await sleep(1000, 'delay before closing viewer');

                closePhotoViewer();
                console.log(`%ccomplete like ${url}, total ${processedPhotos.length}`, 'color: fuchsia');
                await sleep(1000, 'delay after close viewer');

                if (processedPhotos.length < MAX_PHOTOS) {
                    likeNext();
                } else {
                    resolve({ maximumReached: true });
                }
            } else {
                
                resolve({ pageProcessed: true });
            }
        };

        likeNext();
    });
};

const run = async () => {
    console.log('%crun likeRecommends script...', 'color: blue');
    let page = 0;
    
    const likeNextPhotosPart = async () => {
        page++;

        await sleep(3000, `waiting loading resources of page ${page}`);
        const photos = document.querySelectorAll(photoSelector);
        const photosUrls = getPhotosUrls(photos);

        const { maximumReached, pageProcessed } = await likePhotos(photosUrls);

        if (pageProcessed) {
            console.log(`%cpage ${page} have been processed`, 'color: blueviolet');
        }

        if (!maximumReached) {
            scrollDown();
            likeNextPhotosPart();
        } else {
            console.log(`%cFINISH: likeRecommends script complete, total ${processedPhotos.length}`, 'color: green');
        }
    };

    likeNextPhotosPart();
};

run();
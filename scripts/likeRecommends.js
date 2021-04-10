console.log('likeRecommends script');

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

const getNoProcessedPhotos = (newUrlsList = []) => {
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
        console.log('error like');
    }
};

const likePhotos = async nextPhotoUrls => {
    return new Promise(resolve => {
        const photosUrls = getNoProcessedPhotos(nextPhotoUrls);
        console.log('local session:', photosUrls.join(', '));

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
                await sleep(1000, 'delay after close viewer');
                console.log(`complete like ${url}, total ${processedPhotos.length}`);

                likeNext();
            } else {
                console.log('end local session');
                resolve()
            }
        };

        likeNext();
    });
    
};

const run = async () => {
    console.log('run likeRecommends script...');
    let partsCount = 0;
    
    const likeNextPhotosPart = async () => {
        partsCount++;

        await sleep(3000, 'waiting loading resources');
        const photos = document.querySelectorAll(photoSelector);
        const photosUrls = getPhotosUrls(photos);

        await likePhotos(photosUrls);

        if (partsCount <= 3) {
            scrollDown();
            likeNextPhotosPart();
        } else {
            console.log(`likeRecommends script complete!, total ${processedPhotos.length}`);
        }
    };

    likeNextPhotosPart();
};

run();
const MAX_PHOTOS = 500;
const PHOTO_SELECTOR = 'a[href^="/p/"]';

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
    }
};

const closePhotoViewer = () => {
    const closeButton = document.querySelector('div.Igw0E > button.wpO6b');
    closeButton.click();
};

const likePhoto = () => {
    let result = false;
    try {
        const likeBtn = document.querySelector('section.ltpMr > span.fr66n > button.wpO6b');
        const iconLikeBtn = likeBtn.querySelector('svg[aria-label="Нравится"]');
        if (iconLikeBtn) {
            likeBtn.click();
            console.log('%cclick on heart', 'color: orangered');
            result = true;
        }
    } catch (error) {
        console.log('%cerror like', 'color: orange');
    }
    return result;
};

const likePhotos = async () => {
    return new Promise(resolve => {
        const photos = document.querySelectorAll(PHOTO_SELECTOR);
        const nextPhotoUrls = getPhotosUrls(photos);

        const photosUrls = getUnprocessedPhotos(nextPhotoUrls);
        console.log(`%cstart page session: ${photosUrls.join(', ')}, count: ${photosUrls.length}`, 'color: forestgreen');

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
                await sleep(2000, 'before like');

                const liked = likePhoto();

                if (liked) {
                    await sleep(2000, 'before closing viewer');
                    console.log(`%cprocessing completed ${url}, total ${processedPhotos.length}`, 'color: fuchsia');
                } else {
                    console.log(`%cphoto ${url} has already been liked, total ${processedPhotos.length}`, 'color: lightcoral');
                }

                closePhotoViewer();

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

        await sleep(3000, `waiting loading photos ${page}`);

        const { maximumReached, pageProcessed } = await likePhotos();

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

// TODO:
// - обрабатывать фэйл при открытиии вьювера
// - рандомно добавлять комменты?
// - ожидать загрузку страницы по onLoad?

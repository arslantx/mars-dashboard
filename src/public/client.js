
let store = Immutable.Map({
    currentRover: 'Curiosity',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
});

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (state, newState) => {
    renderLoader(root);
    state = state.merge(newState);
    render(root, state);
}

const renderLoader = (rootElement) => {
    rootElement.innerHTML = `<center><img class="loader-image" src="./assets/ajax-loader.gif" width="100px"></center>`;
}

const render = async (rootElement, state) => {
    rootElement.innerHTML = await App(state)
}

const selectRover = (selectedRover) => updateStore(store, {currentRover: selectedRover});

// create content
const App = async (state) => {
    const roverInfoContent = await getRoverInfoContent(state, getRoverData);
    const imageContent = await getImageContent(state, getImageData);
    return `
        <header>
            <h3>Mars Dashboard</h3>
        </header>
        <main>
            <section class="tab-menu">
                <ul>${getTabMenuContent(state)}</ul>
            </section>
            <section class="info-content">
                <ul>${roverInfoContent}</ul>
            </section>
            <section class="image-content">
                ${imageContent}
            </section>
        </main>
        <footer>Design by Arslan Haytiyev</footer>
    `
}

// create tab menu content
const getTabMenuContent = (state) => {
    return state.get('rovers').map(rover => {
        if (rover === state.get('currentRover')) {
            return `<li onclick="selectRover('${rover}')" class="selected-rover">${rover}</li>`;
        } else {
            return `<li onclick="selectRover('${rover}')">${rover}</li>`;
        }
    }).join('');
}

// create rover info content
// this is a High Order function taking in roverDataGetter function as argument
const getRoverInfoContent = (state, roverDataGetter) => {
    return roverDataGetter(state.get('currentRover')).then(resp => {
        return Object.entries(resp).map(([key, value]) => {
            let keyTitle;
            switch (key) {
                case 'launchDate':
                    keyTitle = 'Launch Date';
                    break;
                case 'status':
                    keyTitle = 'Status';
                    break;
                case 'landingDate':
                    keyTitle = 'Landing Date';
                    break;
                case 'lastPhotoDate':
                    keyTitle = 'Last Photo Date';
                    break;
                default:
                    break;
            }
            return `<li>
                <span class="info-title">${keyTitle}:</span>
                <span class="info-value">${value}</span>
            </li>`
        }).join('');
    });
}

const getRoverData = (rover) => {
    return fetch(`http://localhost:3000/roverinfo/${rover}`)
        .then(response => response.json())
        .then(resp => {
            return {
                launchDate: resp.roverData.rover.launch_date,
                landingDate: resp.roverData.rover.landing_date,
                status: resp.roverData.rover.status,
                lastPhotoDate: resp.roverData.rover.max_date,
            }
        })
        .catch(err => console.log(err));
}

// create image content
// this is a High Order function taking in imageDataGetter function as argument
const getImageContent = async (state, imageDataGetter) => {
    return imageDataGetter(state.get('currentRover')).then(resp => {
        return resp.map(img => `
            <img src="${img}">
        `).join('');
    });
}

const getImageData = (rover) => {
    return fetch(`http://localhost:3000/images/${rover}`)
        .then(response => response.json())
        .then(resp => {
            return resp.images.latest_photos.map(e => e.img_src);
        })
        .catch(err => console.log(err));
}

window.addEventListener('load', () => {
    render(root, store)
})


const search = document.querySelector(".search");
const autoComplete = document.querySelector(".autocomplete");
const contentBottom = document.querySelector(".content__bottom");

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}


const inputPrompt=async () => {
    const prompt = search.value;
    autoComplete.innerHTML = '';
    if (prompt){
        try {
            const response = await fetch(`https://api.github.com/search/repositories?q=${prompt}&per_page=5`);
            if (!response.ok){
                console.error(`Ошибка HTTP: ${response.status}`);
                return;
            }
            const data = await response.json();
            const repositories = data.items;
            repositories.forEach(repository => {
                const reposCard = document.createElement('div');
                reposCard.classList.add('repository-card');
                reposCard.textContent = repository.name;
                autoComplete.append(reposCard);
                reposCard.addEventListener('click', () => {
                    const itemCard = document.createElement('div');
                    itemCard.classList.add('item-card');
                    const itemCardWrapper = document.createElement('div');
                    itemCardWrapper.classList.add('item-card-wrapper');
                    const itemName = document.createElement('div');
                    itemName.classList.add('item-card__name');
                    itemName.textContent = `Name: ${repository.name}`;
                    const itemOwner = document.createElement('div');
                    itemOwner.classList.add('item-card__owner');
                    itemOwner.textContent = `Owner: ${repository.owner.login}`;
                    const itemStars = document.createElement('div');
                    itemStars.classList.add('item-card__star');
                    itemStars.textContent =`Stars: ${repository.stargazers_count}`;
                    const itemRemoveButton = document.createElement('button');
                    itemRemoveButton.classList.add('item-card__remove');
                    itemCardWrapper.append(itemName,itemOwner,itemStars);
                    itemCard.append(itemCardWrapper,itemRemoveButton)
                    contentBottom.append(itemCard);
                    autoComplete.innerHTML = '';
                    search.value = '';
                })
            })
        }
        catch(err) {
            console.log(`ошибка данных ${err}}`)
        }
    }
}

search.addEventListener('input', debounce(inputPrompt, 600));

contentBottom.addEventListener('click', (e) => {
    if (e.target.classList.contains('item-card__remove')) {
        const itemCard = e.target.closest('.item-card');
        if (itemCard) {
            contentBottom.removeChild(itemCard);
        }
    }
});

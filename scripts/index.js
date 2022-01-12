import { recipes } from "./recipes.js";

// Ajout des recettes
let recipesSection = $('#recipe_deck')
recipes.forEach(recipe => {

    recipesSection.append(`
    <div class="col-lg-4 col-md-6 col-sm-12" id="recipe_card" data-id=${recipe.id}>
    <div id="recipe_image"><img src="" class="card-img-top" alt=""></div>
    <div class="card-body">
        <div class="row d-flex align-items-center">
            <h2 class="card-title col-7" id="recipe_title">${recipe.name}</h2>
            <p class="col-5" id="recipe_time"><i class="far fa-clock"></i> ${recipe.time} min</p>
        </div>
        <div class="row">
            <ul class="col-5" id="recipe_ingredients_${recipe.id}"></ul>
            <p class="col-7" id="recipe_description">${recipe.description}</p>
        </div>
    </div>
    </div>
    `);

    // Ajout des ingrédients de chaque recette
    recipe.ingredients.forEach(ingredient =>{
        $(`#recipe_ingredients_${recipe.id}`).append(`
        <li><b><span id="recipe_card_ingredient">${ingredient.ingredient}<span></b>: ${ingredient.quantity ? ingredient.quantity : ''} ${ingredient.unit ? ingredient.unit : ''}</li>`)
    })
})

// Majuscule sur le premier mot  
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Ajout de toutes les suggestions d'appareils/d'ustensils/d'ingredients dans leur filtre respectif
let appareilArray = []
let ustensilArray = []
let ingredientArray = []

// Récupère tous les ingrédients des recettes sur la page et les insère dans le tableau 'ingredientArray'
document.querySelectorAll('#recipe_card_ingredient').forEach(ingredient => {
    ingredientArray.push(capitalizeFirstLetter(ingredient.textContent.toLowerCase()))
})

// Passe sur chaque recette
recipes.forEach(recipe =>{
    // Insère chaque appareil dans le tableau 'appareilArray'
    appareilArray.push(capitalizeFirstLetter(recipe.appliance.toString().toLowerCase()))

    // Récupère tous les ustensils de chaque recette et les insère dans le tableau 'ustensilArray'
    let allUstensils = recipe.ustensils.flat()
    allUstensils.forEach(ustensil =>{
        ustensilArray.push(capitalizeFirstLetter(ustensil.toLowerCase()))
    })
})

// On enlève les doublons des tableaux
let ingredientArrayUnique = [...new Set(ingredientArray)];
let appareilArrayUnique = [...new Set(appareilArray)];
let ustensilArrayUnique = [...new Set(ustensilArray)];

// Ajout des éléments dans leur filtre respectif
for (let i = 0; i< ingredientArrayUnique.length; i++){
    let ingredientsList = $('#ingredients')
    ingredientsList.append(`<a class="dropdown-item" id="ingredient_item">`+ingredientArrayUnique[i]+`</a>`)
}

for (let i = 0; i< appareilArrayUnique.length; i++){
    let appareilsList = $('#appareils')
    appareilsList.append(`<a class="dropdown-item" id="appareil_item">`+appareilArrayUnique[i]+`</a>`)
}

for (let i = 0; i< ustensilArrayUnique.length; i++){
    let ustensilsList = $('#ustensils')
    ustensilsList.append(`<a class="dropdown-item" id="ustensil_item">`+ustensilArrayUnique[i]+`</a>`)
}

// Fonction de mise à jour des cartes présentes sur la page 
function currentRecipes (allCardsRecipesArray){
    let allCardRecipes = document.querySelectorAll('#recipe_card')
    allCardRecipes.forEach(recipe => {

        if(!recipe.classList.contains('hidden')){
            allCardsRecipesArray.push(recipe.dataset.id)
        }
    })
    return allCardsRecipesArray
}

// BARRE DE RECHERCHE 
let mainSearchBar = document.querySelector('#search_input')
mainSearchBar.onkeyup = (e)=>{

    document.getElementById('no_result').classList.add('hidden')
    
    let userData = e.target.value; // Entrée de l'utilisateur
    let recipeCards = document.querySelectorAll('#recipe_card')

    // Recherche déclenchée à partir de 3 caractères
    if (userData.length>=3){

        let allCardsRecipesArray = []
        currentRecipes(allCardsRecipesArray)

        // Sélectionne toutes les recettes
        for(let recipeCard of recipeCards){
                            
            // Vise uniquement les recettes qui ne sont pas cachées
            if(allCardsRecipesArray.includes(recipeCard.dataset.id)){       
                // Cache la recette si elle valide l'inverse des conditions suivantes: 
                if(!(
                    // Si la saisie contient le titre de la recette
                    recipeCard.querySelector('#recipe_title').textContent.toLowerCase().includes(userData) ||
                    // Si la saisie contient un mot de la description
                    recipeCard.querySelector('#recipe_description').textContent.toLowerCase().includes(userData) ||
                    // Si la saisie contient un des ingredients de la recette
                    document.querySelectorAll('#recipe_card_ingredient').forEach(cardIngredient => {
                        cardIngredient.innerText.toLowerCase().includes(userData)
                    }))
                ){
                    recipeCard.classList.add('hidden')
                } 
            }
        }
        
        // Si la section de recettes est vide (càd aucun match de recettes), le message d'erreur s'affiche
        if(document.getElementById('recipe_deck').innerText == ''){
            document.getElementById('no_result').classList.remove('hidden')
        }
    }

    // Si la saisie fait moins de 3 caractères et qu'aucun filtre n'est utilisé, toutes les recettes sont affichées
    if (userData.length <=3 && !document.querySelector('#all_tags').hasChildNodes()){
        
        for(let i =0; i<recipeCards.length;i++){
            recipeCards[i].classList.remove('hidden')
        }
    }
}

// FILTRES - FILTRE D'INGRÉDIENT
// Gestion de l'affichage de la liste d'ingrédient présents dans les recettes de la page
let ingredientFilter = document.querySelector('#ingredients_filter')
ingredientFilter.addEventListener ('click', e =>{

    // Récupération de l'id des recettes présentes
    let allCardsRecipesArray = []
    currentRecipes(allCardsRecipesArray)

    // Cache tous les ingrédients de la liste du filtre d'ingrédient
    let ingredientList = document.querySelectorAll('#ingredient_item');
    for(let ingredient of ingredientList){
        ingredient.classList.add('hidden')
    }
    
    // N'affiche dans le filtre que les ingrédients présents dans les recettes de la page
    let allCardRecipes = document.querySelectorAll('#recipe_card')
    allCardRecipes.forEach(card => {

        if(allCardsRecipesArray.indexOf(card.dataset.id)>-1){
            card.querySelectorAll('#recipe_card_ingredient').forEach(ingredient =>{

                for( let i=0; i<ingredientList.length; i++){
                    
                    // Si un ingrédient de la recette correspond à un ingrédient de la liste du filtre, on enlève la classe 'hidden'
                    if(ingredient.textContent.toLowerCase() === ingredientList[i].textContent.toLowerCase()){
                        ingredientList[i].classList.remove('hidden')
                    }
                }
            })
        }
    })
})

// Ajout du tag dans la liste de tags au clic sur un ingrédient de la liste du filtre d'ingrédient
let ingredientList = document.querySelectorAll('#ingredient_item')
ingredientList.forEach(ingredientItem => {
    ingredientItem.addEventListener('click', e => {

        // le marqueur 'on_tag' masque l'ingrédient sélectionné de la liste du filtre
        ingredientItem.classList.add('on_tag')

        // au clic sur un ingrédient de la liste, un élement est généré dans la liste de tag
        let tagsList = $('#all_tags')
        tagsList.append(`<div id="ingredient_tag">`+ingredientItem.textContent+`<a id="close_ingredient_tag"><i class="far fa-times-circle"></a></i><div>`)

        // Ajout d'un marqueur 'ingredient_filter_on' sur les recettes qui possèdent l'ingrédient correspondant à celui sélectionné dans le filtre
        document.querySelectorAll('#recipe_card_ingredient').forEach(ingredient =>{

            if (ingredient.textContent.toLowerCase() == ingredientItem.textContent.toLowerCase()){
                ingredient.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('ingredient_filter_on')
            } 
        })

        // Filtrage des recettes possédant le marqueur 'ingredient_filter_on' et suppression du marqueur après filtrage
        document.querySelectorAll('#recipe_card').forEach(card =>{

            if(!card.classList.contains('ingredient_filter_on')){
                card.classList.add('hidden')
            } else {
                card.classList.remove('ingredient_filter_on')
            }
        })

        // Bouton de fermeture des tags
        document.querySelectorAll('#close_ingredient_tag').forEach(closeTag =>{
            closeTag.addEventListener('click', e =>{

                closeTag.parentNode.remove() // Efface le tag de la liste de tags

                // Ré-affiche l'ingrédient du tag dans la liste du filtre une fois le tag effacé
                ingredientItem.classList.remove('on_tag')

                // Récupère tous les élements actifs de la liste de tags
                document.querySelector('#all_tags').childNodes.forEach(tagItem => {

                    // Tri des tags ingrédients
                    // Compare les éléments actifs de la liste de tags avec tous les ingrédients des recettes et on affiche les recettes qui possèdent au moins un des élément tag
                    document.querySelectorAll('#recipe_card_ingredient').forEach(ingredient => {

                        // Si un élément de la liste des tags correspond à l'un des ingredients présents dans les recettes
                        if(ingredient.textContent.toLowerCase() == tagItem.childNodes[0].textContent.toLowerCase()){

                            // Montre la/les recette(s)
                            ingredient.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.remove('hidden')
                        }
                    })

                    // Tri des tags appareils et ustensils
                    for (let recipe of recipes){

                        // Si un élément de la liste des tags correspond à l'un des appareils ou ustensils du fichier recipe.js
                        if(tagItem.textContent.toLowerCase().includes(recipe.appliance.toLowerCase()) || recipe.ustensils.join(' ').toLowerCase().includes(tagItem.textContent.toLowerCase())){

                            // Récupère toutes les cartes de recettes
                            document.querySelectorAll('#recipe_card').forEach(card => {
    
                                // Compare l'id des recettes avec celles des recettes du fichier recipe.js afin de retrouver l'appareil présent dans la liste des tags
                                if (card.dataset.id == recipe.id.toString()){

                                    // Montre la/les recette(s)
                                    card.classList.remove('hidden')
                                }
                            })
                        }
                    }
                })

                // Si la saisie fait moins de 2 caractères et qu'aucun filtre n'est utilisé, toutes les recettes sont affichées
                let recipeCards = document.querySelectorAll('#recipe_card')
                if (document.querySelector('#search_input').value.toLowerCase()<=3 && !document.querySelector('#all_tags').hasChildNodes()){
                    for(let i =0; i<recipeCards.length;i++){
                        recipeCards[i].classList.remove('hidden')
                    }
                }
            })
        })

        // Si la section de recettes est vide (càd aucun match de recettes), le message d'erreur s'affiche
        if(document.getElementById('recipe_deck').innerText == ''){
            document.getElementById('no_result').classList.remove('hidden')
        }
    })
})

// Barre de recherche du filtre d'ingredient
ingredientFilter.onkeyup = (e)=>{
    let userDataIngredient = e.target.value;
    var key = e.keyCode

    let ingredientList = document.querySelectorAll('#ingredient_item');
    ingredientList.forEach(ingredient =>{

        if (key == 8 && ingredient.classList.contains('on_tag')){
            ingredient.classList.remove('hidden')
        }

        if(!ingredient.textContent.toLowerCase().includes(userDataIngredient.toLowerCase())){
            ingredient.classList.add('hidden')
        } 
    })
}

// FILTRES - FILTRE D'APPAREIL
// Gestion de l'affichage de la liste d'appareil présents dans les recettes de la page
let appareilFilter = document.querySelector('#appareil_filter')
appareilFilter.addEventListener ('click', e =>{

    // Cache tous les appareils de la liste du filtre
    document.querySelectorAll('#appareil_item').forEach(appareilItem => appareilItem.classList.add('hidden'))

    // Récupération de l'id des recettes présentes
    let allCardsRecipesArray = []
    currentRecipes(allCardsRecipesArray)

    document.querySelectorAll('#recipe_card').forEach(card => {

        // Vise uniquement les recettes présentes dans la page
        if (allCardsRecipesArray.includes(card.dataset.id)){
            
            for (let recipe of recipes){

                // Vérifie quel appareil est lié à la recette via son id dans le fichier recipe.js
                if(recipe.id == card.dataset.id){

                    // Les appareils qui correspondent à la recettes sont ré-affichés
                    document.querySelectorAll('#appareil_item').forEach(appareilItem => {
                        if(appareilItem.textContent.toLowerCase() == recipe.appliance.toLowerCase()){
                            appareilItem.classList.remove('hidden')
                        }
                    })
                } 
            }
        }
    })
})

// Barre de recherche du filtre d'appareil
appareilFilter.onkeyup = (e)=>{
    let userDataAppareil = e.target.value;
    var key = e.keyCode

    let appareilFilter = document.querySelectorAll('#appareil_item');
    appareilFilter.forEach(appareil =>{

        if (key == 8 && ingredient.classList.contains('on_tag')){
            appareil.classList.remove('hidden')
        }

        if(!appareil.textContent.toLowerCase().includes(userDataAppareil.toLowerCase())){
            appareil.classList.add('hidden')
        } 
    })
}

// Ajout du tag dans la liste de tags au clic sur un appareil de la liste du filtre d'appareil
let appareilList = document.querySelectorAll('#appareil_item')
appareilList.forEach(appareilItem => {
    appareilItem.addEventListener('click', e =>{

        // le marqueur 'on_tag' masque l'appareil sélectionné de la liste du filtre
        appareilItem.classList.add('on_tag')

        // au clic sur un appareil de la liste, un élement est généré dans la liste de tag
        let tagsList = $('#all_tags')
        tagsList.append(`<div id="appareil_tag">`+appareilItem.textContent+`<a id="close_appareil_tag"><i class="far fa-times-circle"></a></i><div>`)

        // Récupère l'id des recettes présentes dans la page
        let allCardsRecipesArray = []
        currentRecipes (allCardsRecipesArray)
    
        for (let recipe of recipes){

            // Compare l'id des recettes présentes avec celles des recettes du fichier recipe.js afin de retrouver le/les appareil(s) respectif(s) de chaque recette 
            if(allCardsRecipesArray.includes(recipe.id.toString()) && appareilItem.textContent.toLowerCase() == recipe.appliance.toLowerCase()){

                // Récupère toutes les cartes de recettes
                document.querySelectorAll('#recipe_card').forEach(card => {

                    // Ajoute le marqueur 'appareil_filter_on'
                    if (card.dataset.id == recipe.id.toString()){
                        card.classList.add('appareil_filter_on')
                    }
                })
            }
        }

        // Récupère toutes les cartes recettes
        document.querySelectorAll('#recipe_card').forEach(card => {

            // Utilisation du marqueur pour trier les recettes qui le possèdent
            if (!card.classList.contains('appareil_filter_on')){
                card.classList.add('hidden')
            } else {
                card.classList.remove('appareil_filter_on')
            }
        })

        // Bouton de fermeture des tags
        document.querySelectorAll('#close_appareil_tag').forEach(closeTag => {
            closeTag.addEventListener('click', e =>{

                closeTag.parentNode.remove() // Efface le tag de la liste de tags

                // Ré-affiche l'ingrédient du tag dans la liste du filtre une fois le tag effacé
                appareilItem.classList.remove('on_tag')

                // Récupère tous les élements actifs de la liste de tags
                document.querySelector('#all_tags').childNodes.forEach(tagItem => {

                    // Tri des tags ingrédients
                    // Compare les éléments actifs de la liste de tags avec tous les ingrédients des recettes et on affiche les recettes qui possèdent au moins un des élément tag
                    document.querySelectorAll('#recipe_card_ingredient').forEach(ingredient => {
                        // Si un élément de la liste des tags correspond à l'un des ingredients présents dans les recettes
                        if(ingredient.textContent.toLowerCase() == tagItem.childNodes[0].textContent.toLowerCase()){

                            // Montre la/les recette(s)
                            ingredient.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.remove('hidden')
                        }
                    })

                    // Tri des tags appareils et ustensils
                    for (let recipe of recipes){

                        // Si un élément de la liste des tags correspond à l'un des appareils ou ustensils du fichier recipe.js
                        if(tagItem.textContent.toLowerCase().includes(recipe.appliance.toLowerCase()) || recipe.ustensils.join(' ').toLowerCase().includes(tagItem.textContent.toLowerCase())){

                            // Récupère toutes les cartes de recettes
                            document.querySelectorAll('#recipe_card').forEach(card => {
    
                                // Compare l'id des recettes avec celles des recettes du fichier recipe.js afin de retrouver l'appareil présent dans la liste des tags
                                if (card.dataset.id == recipe.id.toString()){

                                    // Montre la/les recette(s)
                                    card.classList.remove('hidden')
                                }
                            })
                        }
                    }
                })

                // Si la saisie fait moins de 2 caractères et qu'aucun filtre n'est utilisé, toutes les recettes sont affichées
                let recipeCards = document.querySelectorAll('#recipe_card')
                if (document.querySelector('#search_input').value.toLowerCase()<=3 && !document.querySelector('#all_tags').hasChildNodes()){
                    for(let i =0; i<recipeCards.length;i++){
                        recipeCards[i].classList.remove('hidden')
                    }
                }
            })
        })
    })
})

// FILTRES - FILTRE D'USTENSIL
// Gestion de l'affichage de la liste des ustensils présents dans les recettes de la page
let ustensilFilter = document.querySelector('#ustensils_filter')
ustensilFilter.addEventListener('click', e =>{

    // Cache tous les ustensils de la liste du filtre
    document.querySelectorAll('#ustensil_item').forEach(ustensilItem => ustensilItem.classList.add('hidden'))

    // Récupération de l'id des recettes présentes
    let allCardsRecipesArray = []
    currentRecipes(allCardsRecipesArray)

    document.querySelectorAll('#recipe_card').forEach(card => {

        // Vise uniquement les recettes présentes dans la page
        if (allCardsRecipesArray.includes(card.dataset.id)){
            
            for (let recipe of recipes){

                // Vérifie quel ustensil est lié à la recette via son id dans le fichier recipe.js
                if(recipe.id == card.dataset.id){

                    // Les ustensils qui correspondent à la recettes sont ré-affichés
                    document.querySelectorAll('#ustensil_item').forEach(ustensilItem => {

                        if(recipe.ustensils.includes(ustensilItem.textContent.toLowerCase())){
                            ustensilItem.classList.remove('hidden')
                        }
                    })
                } 
            }
        }
    })
})

// Barre de recherche du filtre d'ustensil
ustensilFilter.onkeyup = (e)=>{
    let userDataUstensil = e.target.value;
    var key = e.keyCode

    let ustensilFilter = document.querySelectorAll('#ustensil_item');
    ustensilFilter.forEach(ustensil =>{

        if (key == 8 && ustensil.classList.contains('on_tag')){
            ustensil.classList.remove('hidden')
        }

        if(!ustensil.textContent.toLowerCase().includes(userDataUstensil.toLowerCase())){
            ustensil.classList.add('hidden')
        } 
    })
}

// Ajout du tag dans la liste de tags au clic sur un ustensil de la liste du filtre d'ustensil
let ustensilList = document.querySelectorAll('#ustensil_item')
ustensilList.forEach(ustensilItem => {
    ustensilItem.addEventListener('click', e =>{

        // le marqueur 'on_tag' masque l'ustensil sélectionné de la liste du filtre
        ustensilItem.classList.add('on_tag')

        // au clic sur un ustensil de la liste, un élement est généré dans la liste de tag
        let tagsList = $('#all_tags')
        tagsList.append(`<div id="ustensil_tag">`+ustensilItem.textContent+`<a id="close_ustensil_tag"><i class="far fa-times-circle"></a></i><div>`)

        // Récupère l'id des recettes présentes dans la page
        let allCardsRecipesArray = []
        currentRecipes (allCardsRecipesArray)
    
        for (let recipe of recipes){

            // Compare l'id des recettes présentes avec celles des recettes du fichier recipe.js afin de retrouver le/les ustensil(s) respectif(s) de chaque recette 
            if(allCardsRecipesArray.includes(recipe.id.toString()) && recipe.ustensils.join(' ').toLowerCase().includes(ustensilItem.textContent.toLowerCase())){

                // Récupère toutes les cartes de recettes
                document.querySelectorAll('#recipe_card').forEach(card => {

                    // Ajoute le marqueur 'ustensil_filter_on'
                    if (card.dataset.id == recipe.id.toString()){
                        card.classList.add('ustensil_filter_on')
                    }
                })
            }
        }

        // Récupère toutes les cartes recettes
        document.querySelectorAll('#recipe_card').forEach(card => {

            // Utilisation du marqueur pour trier les recettes qui le possèdent
            if (!card.classList.contains('ustensil_filter_on')){
                card.classList.add('hidden')
            } else {
                card.classList.remove('ustensil_filter_on')
            }
        })

        // Bouton de fermeture des tags
        document.querySelectorAll('#close_ustensil_tag').forEach(closeTag => {
            closeTag.addEventListener('click', e =>{

                closeTag.parentNode.remove() // Efface le tag de la liste de tags 

                // Ré-affiche l'ustensil du tag dans la liste du filtre une fois le tag effacé
                ustensilItem.classList.remove('on_tag')

                // Récupère tous les élements actifs de la liste de tags
                document.querySelector('#all_tags').childNodes.forEach(tagItem => {

                    // Tri des tags ingrédients
                    // Compare les éléments actifs de la liste de tags avec tous les ingrédients des recettes et on affiche les recettes qui possèdent au moins un des élément tag
                    document.querySelectorAll('#recipe_card_ingredient').forEach(ingredient => {
                        // Si un élément de la liste des tags correspond à l'un des ingredients présents dans les recettes
                        if(ingredient.textContent.toLowerCase() == tagItem.childNodes[0].textContent.toLowerCase()){

                            // Montre la/les recette(s)
                            ingredient.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.remove('hidden')
                        }
                    })

                    // Tri des tags appareils et ustensils
                    for (let recipe of recipes){

                        // Si un élément de la liste des tags correspond à l'un des appareils ou ustensils du fichier recipe.js
                        if(tagItem.textContent.toLowerCase().includes(recipe.appliance.toLowerCase()) || recipe.ustensils.join(' ').toLowerCase().includes(tagItem.textContent.toLowerCase())){

                            // Récupère toutes les cartes de recettes
                            document.querySelectorAll('#recipe_card').forEach(card => {
    
                                // Compare l'id des recettes avec celles des recettes du fichier recipe.js afin de retrouver l'appareil présent dans la liste des tags
                                if (card.dataset.id == recipe.id.toString()){

                                    // Montre la/les recette(s)
                                    card.classList.remove('hidden')
                                }
                            })
                        }
                    }
                })

                // Si la saisie fait moins de 2 caractères et qu'aucun filtre n'est utilisé, toutes les recettes sont affichées
                let recipeCards = document.querySelectorAll('#recipe_card')
                if (document.querySelector('#search_input').value.toLowerCase()<=3 && !document.querySelector('#all_tags').hasChildNodes()){
                    for(let i =0; i<recipeCards.length;i++){
                        recipeCards[i].classList.remove('hidden')
                    }
                }
            })
        })
    })
})

import { recipes } from "./recipes.js";

// Ajout des recettes dans la page grâce au fichier recipe.js
let recipesSection = $('#recipe_deck');
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
        <li><b><span id="recipe_card_ingredient">${ingredient.ingredient}<span></b>: ${ingredient.quantity ? ingredient.quantity : ''} ${ingredient.unit ? ingredient.unit : ''}</li>`);
    });
});

/////////////// AFFICHAGE DES ÉLÉMENTS DANS LEUR FILTRE RESPECTIF SANS DOUBLONS ///////////////

// Fonction d'ajout d'une majuscule sur le premier mot  
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Tableaux vides de stockage temporaire
let appareilArray = [];
let ustensilArray = [];
let ingredientArray = [];

// Ajout de toutes les suggestions d'appareils/d'ustensils/d'ingredients dans leur filtre respectif
recipes.forEach(recipe =>{
    // Insère chaque appareil dans le tableau 'appareilArray'
    appareilArray.push(capitalizeFirstLetter(recipe.appliance.toString().toLowerCase()));

    // Récupère tous les ustensils de chaque recette et les insère dans le tableau 'ustensilArray'
    let allUstensils = recipe.ustensils.flat();
    allUstensils.forEach(ustensil =>{
        ustensilArray.push(capitalizeFirstLetter(ustensil.toLowerCase()));
    });
});

// Récupère tous les ingrédients des recettes sur la page et les insère dans le tableau 'ingredientArray'
document.querySelectorAll('#recipe_card_ingredient').forEach(ingredient => {
    ingredientArray.push(capitalizeFirstLetter(ingredient.textContent.toLowerCase()));
});

// On enlève les doublons des tableaux et on les insère dans des nouveaux tableaux
let ingredientArrayUnique = [...new Set(ingredientArray)];
let appareilArrayUnique = [...new Set(appareilArray)];
let ustensilArrayUnique = [...new Set(ustensilArray)];

// Ajout des éléments dans leur filtre respectif
for (let i = 0; i< ingredientArrayUnique.length; i++){
    let ingredientsList = $('#ingredients');
    ingredientsList.append(`<a class="dropdown-item" id="ingredient_item">`+ingredientArrayUnique[i]+`</a>`);
}

for (let i = 0; i< appareilArrayUnique.length; i++){
    let appareilsList = $('#appareils');
    appareilsList.append(`<a class="dropdown-item" id="appareil_item">`+appareilArrayUnique[i]+`</a>`);
}

for (let i = 0; i< ustensilArrayUnique.length; i++){
    let ustensilsList = $('#ustensils');
    ustensilsList.append(`<a class="dropdown-item" id="ustensil_item">`+ustensilArrayUnique[i]+`</a>`);
}

/////////////// FONCTIONS DE TRI ///////////////

// Fonction de récupération de l'id des cartes présentes dans la page
function currentRecipes (allCardsRecipesArray){
    let allCardRecipes = document.querySelectorAll('#recipe_card');
    allCardRecipes.forEach(recipe => {

        if(!recipe.classList.contains('hidden')){
            allCardsRecipesArray.push(recipe.dataset.id);
        }
    });
    return allCardsRecipesArray;
}

// Fonction de tri via la barre de recherche
function searchbarFilter (recipeCards){
    
    // Tri des recettes par rapport à la barre de recherche
    for(let card of recipeCards){
            
        // Récupère tous les ingrédients d'une carte recette dans un tableau
        let ingredientArray = []
        card.querySelectorAll('#recipe_card_ingredient').forEach(cardIngredient => {
            ingredientArray.push(cardIngredient.innerText.toString().toLowerCase())
        })

        // Cache la recette si elle valide l'inverse des conditions suivantes: 
        if(!(
            // Si la saisie contient le titre de la recette ou
            card.querySelector('#recipe_title').textContent.toLowerCase().includes(document.querySelector('#search_input').value.toLowerCase()) ||
            // Si la saisie contient un mot de la description ou
            card.querySelector('#recipe_description').textContent.toLowerCase().includes(document.querySelector('#search_input').value.toLowerCase()) ||
            // Si la saisie contient un des ingredients de la recette contenus dans le tableau
            ingredientArray.join(' ').includes(document.querySelector('#search_input').value.toLowerCase())
            )
        ){
            card.classList.add('hidden');
        } 
    } 
}

// Fonction de tri via les tags
function filtersFilter (tagsArray){

    // Tri des recettes par rapport aux tags 
    for (let recipe of recipes){ 

        // Filtrage par rapport aux tags ingrédients
        if(document.querySelector('#all_tags').contains(document.querySelector('#ingredient_tag'))){

            document.querySelectorAll('#recipe_card_ingredient').forEach(ingredient =>{

                // Ajout d'un marqueur de validation
                if (tagsArray.includes(ingredient.textContent.toLowerCase())){
                    ingredient.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('ingredient_filter_on');
                } 
            });

        // S'il n'y a pas de tag d'ingrédient sélectionné, on ajoute automatiquement le marqueur de validation
        } else {
            document.querySelectorAll('#recipe_card').forEach(card => {
                card.classList.add('ingredient_filter_on');
            });
        }

        // Filtrage par rapport aux tags appareils
        if(document.querySelector('#all_tags').contains(document.querySelector('#appareil_tag'))){

            if(tagsArray.includes(recipe.appliance.toLowerCase())){

                document.querySelectorAll('#recipe_card').forEach(card => {
                    if (card.dataset.id == recipe.id.toString()){
                        card.classList.add('appareil_filter_on');
                    }
                });
            }

        // S'il n'y a pas de tag d'appareil sélectionné, on ajoute automatiquement le marqueur de validation
        } else {
            document.querySelectorAll('#recipe_card').forEach(card => {
                card.classList.add('appareil_filter_on');
            });
        }

        // Filtrage par rapport aux tags ustensils
        // Il y a plusieurs ustensils par recettes, ce qui peut fausser le tri en ajoutant le marqueur de vérification sur une recette qui ne possèderait pourtant qu'un seul ustensil des hypothétiques plusieurs ustensils de la liste de tags 

        // On ajoute tous les tag ustensils dans un tableau
        let ustensilTagArray = [];
        document.querySelectorAll('#ustensil_tag').forEach(ustensilTag => {
            ustensilTagArray.push(ustensilTag.textContent.toLowerCase());
        });

        // Fonction qui vérifie que tous les éléments d'un tableau sont également contenus dans un autre tableau
        let compareArrays = (arr, target) => target.every(v => arr.includes(v));

        if(document.querySelector('#all_tags').contains(document.querySelector('#ustensil_tag'))){

            if(compareArrays(recipe.ustensils.map(ustensil => ustensil.toLowerCase()),ustensilTagArray)){

                document.querySelectorAll('#recipe_card').forEach(card => {

                    if (card.dataset.id == recipe.id.toString()){
                        card.classList.add('ustensil_filter_on');
                    }
                });
            } 

        // S'il n'y a pas de tag d'ustensil sélectionné, on ajoute automatiquement le marqueur de validation
        } else {
            document.querySelectorAll('#recipe_card').forEach(card => {
                card.classList.add('ustensil_filter_on');
            });
        }
    }

    // Trie les recettes selon la présence des marqueurs
    document.querySelectorAll('#recipe_card').forEach(card => {

        // Si la carte recette ne possède pas les 3 marqueurs de validation, on la cache 
        if(!(card.classList.contains('ingredient_filter_on') && card.classList.contains('appareil_filter_on') && card.classList.contains('ustensil_filter_on'))){
            
            card.classList.add('hidden');
            card.classList.remove('ingredient_filter_on');
            card.classList.remove('appareil_filter_on');
            card.classList.remove('ustensil_filter_on');
        } else {
            card.classList.remove('ingredient_filter_on');
            card.classList.remove('appareil_filter_on');
            card.classList.remove('ustensil_filter_on');
        }
    });
}

/////////////// BARRE DE RECHERCHE ///////////////

let mainSearchBar = document.querySelector('#search_input');
mainSearchBar.onkeyup = (e)=>{

    document.getElementById('no_result').classList.add('hidden'); // Message d'erreur caché
    
    let userData = e.target.value; // Entrée de l'utilisateur
    let recipeCards = document.querySelectorAll('#recipe_card'); // Toutes les cartes recettes

    // Affiche toutes les recettes pour le tri
    document.querySelectorAll('#recipe_card').forEach(card => card.classList.remove('hidden'));

    // Recherche déclenchée à partir de 3 caractères
    if(userData.length>=3){

        // Tri via la barre de recherche
        searchbarFilter (recipeCards);

        // Tableau contenant tous les tags visuels
        let tagsArray = [];
        document.querySelector('#all_tags').childNodes.forEach(tagItem => {
            tagsArray.push(tagItem.textContent.toLowerCase());
        });

        // Tri via les tags
        filtersFilter (tagsArray);
    }

    // Tri déclenché si la liste de tags possède des éléments et que la saisie fait moins de 3 caractères
    if(userData.length <=3 && document.querySelector('#all_tags').hasChildNodes()){

        // Tableau contenant tous les tags visuels
        let tagsArray = [];
        document.querySelector('#all_tags').childNodes.forEach(tagItem => {
            tagsArray.push(tagItem.textContent.toLowerCase());
        });

        // Tri via les tags
        filtersFilter (tagsArray);
    }

    // Si la saisie fait moins de 3 caractères et qu'aucun filtre n'est utilisé, toutes les recettes sont affichées
    if(userData.length <=3 && !document.querySelector('#all_tags').hasChildNodes()){
        for(let i =0; i<recipeCards.length;i++){
            recipeCards[i].classList.remove('hidden');
        }
    }
};

/////////////// FILTRES ///////////////

// FILTRE INGRÉDIENT
// Gestion de l'affichage des élements de la liste du filtre d'ingrédient
let ingredientFilter = document.querySelector('#ingredients_filter');
ingredientFilter.addEventListener ('click', e =>{

    // Récupération de l'id des recettes présentes
    let allCardsRecipesArray = [];
    currentRecipes(allCardsRecipesArray);

    // Cache tous les ingrédients de la liste du filtre d'ingrédient
    let ingredientList = document.querySelectorAll('#ingredient_item');
    for(let ingredient of ingredientList){
        ingredient.classList.add('hidden');

        // Suppression du marqueur pour la barre de recherche du filtre
        ingredient.classList.remove('ingredient_item_on');
    }
    
    // N'affiche dans le filtre que les ingrédients présents dans les recettes de la page
    let allCardRecipes = document.querySelectorAll('#recipe_card');
    allCardRecipes.forEach(card => {

        // Vise uniquement les recettes présentes dans la page
        if(allCardsRecipesArray.indexOf(card.dataset.id)>-1){
            card.querySelectorAll('#recipe_card_ingredient').forEach(ingredient =>{

                for( let i=0; i<ingredientList.length; i++){
                    
                    // On boucle sur les ingrédients de la liste pour retrouver les ingrédients de la carte recette pour les rendre visible
                    if(ingredient.textContent.toLowerCase() === ingredientList[i].textContent.toLowerCase()){
                        ingredientList[i].classList.remove('hidden');

                        // Ajout d'un marqueur pour la barre de recherche du filtre
                        ingredientList[i].classList.add('ingredient_item_on');
                    }
                }
            });
        }
    });
});

// Barre de recherche du filtre d'ingredient
ingredientFilter.onkeyup = (e)=>{
    let userDataIngredient = e.target.value; // Saisie de l'utilisateur

    let ingredientList = document.querySelectorAll('#ingredient_item');
    ingredientList.forEach(ingredient =>{

        ingredient.classList.add('hidden');

        // Si l'élément de la liste du filtre n'est pas sélectionné comme tag et qu'il possède le marqueur 'ingredient_item_on'
        if (!ingredient.classList.contains('on_tag') && ingredient.classList.contains('ingredient_item_on')){
            ingredient.classList.remove('hidden');
        }

        // Les élements qui ne correspondent pas avec la saisie de l'utilisateur sont cachés
        if(!ingredient.textContent.toLowerCase().includes(userDataIngredient.toLowerCase())){
            ingredient.classList.add('hidden');
        } 
    });
};

// Ajout d'un tag visuel au clic sur un élement de la liste du filtre d'ingrédient
let ingredientList = document.querySelectorAll('#ingredient_item');
ingredientList.forEach(ingredientItem => {
    ingredientItem.addEventListener('click', e => {

        // le marqueur 'on_tag' masque l'élément sélectionné de la liste du filtre
        ingredientItem.classList.add('on_tag');

        // au clic sur un élément de la liste, un tag visuel est généré et stocké dans la liste des tags
        let tagsList = $('#all_tags');
        tagsList.append(`<div id="ingredient_tag">`+ingredientItem.textContent+`<a id="close_ingredient_tag"><i class="far fa-times-circle"></a></i><div>`);

        // Ajout d'un marqueur 'ingredient_filter_on' sur les recettes qui possèdent l'élément ingrédient sélectionné
        document.querySelectorAll('#recipe_card_ingredient').forEach(ingredient =>{

            if (ingredient.textContent.toLowerCase() == ingredientItem.textContent.toLowerCase()){
                ingredient.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('ingredient_filter_on');
            } 
        });

        // Garde les recettes possédant le marqueur 'ingredient_filter_on' et suppression du marqueur après filtrage
        document.querySelectorAll('#recipe_card').forEach(card =>{

            if(!card.classList.contains('ingredient_filter_on')){
                card.classList.add('hidden');
            } else {
                card.classList.remove('ingredient_filter_on');
            }
        });

        // Bouton de fermeture des tags
        document.querySelectorAll('#close_ingredient_tag').forEach(closeTag => {
            closeTag.addEventListener('click', e =>{

                closeTag.parentNode.remove(); // Efface le tag visuel de la liste de tags 

                // Ré-affiche l'élément dans la liste de filtre
                ingredientItem.classList.remove('on_tag');
                // Affiche toutes les recettes pour le tri
                let recipeCards = document.querySelectorAll('#recipe_card');
                for(let i =0; i<recipeCards.length;i++){
                    recipeCards[i].classList.remove('hidden');
                }

                let allCardsRecipesArray = [];
                currentRecipes(allCardsRecipesArray);
        
                // Tri via la barre de recherche
                searchbarFilter (recipeCards);
        
                // Tableau contenant tous les tags visuels
                let tagsArray = [];
                document.querySelector('#all_tags').childNodes.forEach(tagItem => {
                    tagsArray.push(tagItem.textContent.toLowerCase());
                });
        
                // Tri via les tags
                filtersFilter (tagsArray);

                // Si la saisie est inférieure à 3 caractères et que la liste des tags est vide
                if(document.querySelector('#search_input').value.length<=3 && !document.querySelector('#all_tags').hasChildNodes()) {
                    for(let i =0; i<recipeCards.length;i++){
                        recipeCards[i].classList.remove('hidden');
                    }
                }
            });
        });
    });
});

// FILTRE APPAREIL
// Gestion de l'affichage des élements de la liste du filtre d'appareil
let appareilFilter = document.querySelector('#appareil_filter');
appareilFilter.addEventListener ('click', e =>{

    // Cache tous les élements de la liste du filtre d'appareil
    document.querySelectorAll('#appareil_item').forEach(appareilItem => {
        appareilItem.classList.add('hidden');

        // Suppression du marqueur pour la barre de recherche du filtre
        appareilItem.classList.remove('appareil_item_on');
    });

    // Récupération de l'id des recettes présentes
    let allCardsRecipesArray = [];
    currentRecipes(allCardsRecipesArray);

    document.querySelectorAll('#recipe_card').forEach(card => {

        // Vise uniquement les recettes présentes dans la page
        if (allCardsRecipesArray.includes(card.dataset.id)){
            
            for (let recipe of recipes){

                // Fait correspondre l'id de la carte recette avec sa recette du fichier recipes.js pour retrouver les appareils
                if(recipe.id == card.dataset.id){

                    // Les appareils qui correspondent à la recettes sont ré-affichés
                    document.querySelectorAll('#appareil_item').forEach(appareilItem => {
                        if(appareilItem.textContent.toLowerCase() == recipe.appliance.toLowerCase()){
                            appareilItem.classList.remove('hidden');

                            // Ajout d'un marqueur pour la barre de recherche du filtre
                            appareilItem.classList.add('appareil_item_on');
                        }
                    });
                } 
            }
        }
    });
});

// Barre de recherche du filtre d'appareil
appareilFilter.onkeyup = (e)=>{
    let userDataAppareil = e.target.value; // Saisie de l'utilisateur

    let appareilFilter = document.querySelectorAll('#appareil_item');
    appareilFilter.forEach(appareil =>{

        // Si l'élément de la liste du filtre n'est pas sélectionné comme tag et qu'il possède le marqueur 'appareil_item_on'
        if (!appareil.classList.contains('on_tag') && appareil.classList.contains('appareil_item_on')){
            appareil.classList.remove('hidden');
        }

        // Les élements qui ne correspondent pas avec la saisie de l'utilisateur sont cachés
        if(!appareil.textContent.toLowerCase().includes(userDataAppareil.toLowerCase())){
            appareil.classList.add('hidden');
        } 
    });
};

// Ajout d'un tag visuel au clic sur un élement de la liste du filtre d'appareil
let appareilList = document.querySelectorAll('#appareil_item');
appareilList.forEach(appareilItem => {
    appareilItem.addEventListener('click', e =>{

        // le marqueur 'on_tag' masque l'appareil sélectionné de la liste du filtre
        appareilItem.classList.add('on_tag');

        // au clic sur un élément de la liste, un tag visuel est généré et stocké dans la liste des tags
        let tagsList = $('#all_tags');
        tagsList.append(`<div id="appareil_tag">`+appareilItem.textContent+`<a id="close_appareil_tag"><i class="far fa-times-circle"></a></i><div>`);

        // Récupère l'id des recettes présentes dans la page
        let allCardsRecipesArray = [];
        currentRecipes (allCardsRecipesArray);
    
        for (let recipe of recipes){

            // Compare l'id des recettes présentes avec celles des recettes du fichier recipe.js afin de retrouver le/les appareil(s) respectif(s) de chaque recette 
            if(allCardsRecipesArray.includes(recipe.id.toString()) && appareilItem.textContent.toLowerCase() == recipe.appliance.toLowerCase()){

                // Récupère toutes les cartes de recettes
                document.querySelectorAll('#recipe_card').forEach(card => {

                    // Ajoute le marqueur 'appareil_filter_on'
                    if (card.dataset.id == recipe.id.toString()){
                        card.classList.add('appareil_filter_on');
                    }
                });
            }
        }

        // Récupère toutes les cartes recettes
        document.querySelectorAll('#recipe_card').forEach(card => {

            // Utilisation du marqueur pour trier les recettes qui le possèdent
            if (!card.classList.contains('appareil_filter_on')){
                card.classList.add('hidden');
            } else {
                card.classList.remove('appareil_filter_on');
            }
        });

        // Bouton de fermeture des tags
        document.querySelectorAll('#close_appareil_tag').forEach(closeTag => {
            closeTag.addEventListener('click', e =>{

                closeTag.parentNode.remove(); // Efface le tag visuel de la liste de tags 

                // Ré-affiche l'élément dans la liste de filtre
                appareilItem.classList.remove('on_tag');
                
                // Affiche toutes les recettes pour le tri
                let recipeCards = document.querySelectorAll('#recipe_card');
                for(let i =0; i<recipeCards.length;i++){
                    recipeCards[i].classList.remove('hidden');
                }

                let allCardsRecipesArray = [];
                currentRecipes(allCardsRecipesArray);
        
                // Tri via la barre de recherche
                searchbarFilter (recipeCards);
        
                // Tableau contenant tous les tags visuels
                let tagsArray = [];
                document.querySelector('#all_tags').childNodes.forEach(tagItem => {
                    tagsArray.push(tagItem.textContent.toLowerCase());
                });
        
                // Tri via les tags
                filtersFilter (tagsArray);

                // Si la saisie est inférieure à 3 caractères et que la liste des tags est vide
                if(document.querySelector('#search_input').value.length<=3 && !document.querySelector('#all_tags').hasChildNodes()) {
                    for(let i =0; i<recipeCards.length;i++){
                        recipeCards[i].classList.remove('hidden');
                    }
                }
            });
        });
    });
});

// FILTRE USTENSIL
// Gestion de l'affichage des élements de la liste du filtre d'ustensil
let ustensilFilter = document.querySelector('#ustensils_filter');
ustensilFilter.addEventListener('click', e =>{

    // Cache tous les élements de la liste du filtre d'appareil
    document.querySelectorAll('#ustensil_item').forEach(ustensilItem => {
        ustensilItem.classList.add('hidden');

        // Suppression du marqueur pour la barre de recherche du filtre
        ustensilItem.classList.remove('ustensil_item_on');
    });

    // Récupération de l'id des recettes présentes
    let allCardsRecipesArray = [];
    currentRecipes(allCardsRecipesArray);

    document.querySelectorAll('#recipe_card').forEach(card => {

        // Vise uniquement les recettes présentes dans la page
        if (allCardsRecipesArray.includes(card.dataset.id)){
            
            for (let recipe of recipes){

                // Vérifie quel ustensil est lié à la recette via son id dans le fichier recipe.js
                if(recipe.id == card.dataset.id){

                    // Les ustensils qui correspondent à la recettes sont ré-affichés
                    document.querySelectorAll('#ustensil_item').forEach(ustensilItem => {

                        if(recipe.ustensils.includes(ustensilItem.textContent.toLowerCase())){
                            ustensilItem.classList.remove('hidden');

                            // Ajout d'un marqueur pour la barre de recherche du filtre
                            ustensilItem.classList.add('ustensil_item_on');
                        }
                    });
                } 
            }
        }
    });
});

// Barre de recherche du filtre d'ustensil
ustensilFilter.onkeyup = (e)=>{
    let userDataUstensil = e.target.value; // Saisie de l'utilisateur

    let ustensilFilter = document.querySelectorAll('#ustensil_item');
    ustensilFilter.forEach(ustensil =>{

        // Si l'élément de la liste du filtre n'est pas sélectionné comme tag et qu'il possède le marqueur 'iustensil_item_on'
        if (!ustensil.classList.contains('on_tag') && ustensil.classList.contains('ustensil_item_on')){
            ustensil.classList.remove('hidden');
        }

        // Les élements qui ne correspondent pas avec la saisie de l'utilisateur sont cachés
        if(!ustensil.textContent.toLowerCase().includes(userDataUstensil.toLowerCase())){
            ustensil.classList.add('hidden');
        } 
    });
};

// Ajout d'un tag visuel au clic sur un élement de la liste du filtre d'ustensil
let ustensilList = document.querySelectorAll('#ustensil_item');
ustensilList.forEach(ustensilItem => {
    ustensilItem.addEventListener('click', e =>{

        // le marqueur 'on_tag' masque l'ustensil sélectionné de la liste du filtre
        ustensilItem.classList.add('on_tag');

        // au clic sur un élément de la liste, un tag visuel est généré et stocké dans la liste des tags
        let tagsList = $('#all_tags');
        tagsList.append(`<div id="ustensil_tag">`+ustensilItem.textContent+`<a id="close_ustensil_tag"><i class="far fa-times-circle"></a></i><div>`);

        // Récupère l'id des recettes présentes dans la page
        let allCardsRecipesArray = [];
        currentRecipes (allCardsRecipesArray);
    
        for (let recipe of recipes){

            // Compare l'id des recettes présentes avec celles des recettes du fichier recipe.js afin de retrouver le/les ustensil(s) respectif(s) de chaque recette 
            if(allCardsRecipesArray.includes(recipe.id.toString()) && recipe.ustensils.join(' ').toLowerCase().includes(ustensilItem.textContent.toLowerCase())){

                // Récupère toutes les cartes de recettes
                document.querySelectorAll('#recipe_card').forEach(card => {

                    // Ajoute le marqueur 'ustensil_filter_on'
                    if (card.dataset.id == recipe.id.toString()){
                        card.classList.add('ustensil_filter_on');
                    }
                });
            }
        }

        // Récupère toutes les cartes recettes
        document.querySelectorAll('#recipe_card').forEach(card => {

            // Utilisation du marqueur pour trier les recettes qui le possèdent
            if (!card.classList.contains('ustensil_filter_on')){
                card.classList.add('hidden');
            } else {
                card.classList.remove('ustensil_filter_on');
            }
        });

        // Bouton de fermeture des tags
        document.querySelectorAll('#close_ustensil_tag').forEach(closeTag => {
            closeTag.addEventListener('click', e =>{

                closeTag.parentNode.remove(); // Efface le tag visuel de la liste de tags 

                // Ré-affiche l'élément dans la liste de filtre
                ustensilItem.classList.remove('on_tag');

                // Affiche toutes les recettes pour le tri
                let recipeCards = document.querySelectorAll('#recipe_card');
                for(let i =0; i<recipeCards.length;i++){
                    recipeCards[i].classList.remove('hidden');
                }

                let allCardsRecipesArray = [];
                currentRecipes(allCardsRecipesArray);
        
                // Tri via la barre de recherche
                searchbarFilter (recipeCards);
        
                // Tableau contenant tous les tags visuels
                let tagsArray = [];
                document.querySelector('#all_tags').childNodes.forEach(tagItem => {
                    tagsArray.push(tagItem.textContent.toLowerCase());
                });
        
                // Tri via les tags
                filtersFilter (tagsArray);

                // Si la saisie est inférieure à 3 caractères et que la liste des tags est vide
                if(document.querySelector('#search_input').value.length<=3 && !document.querySelector('#all_tags').hasChildNodes()) {
                    for(let i =0; i<recipeCards.length;i++){
                        recipeCards[i].classList.remove('hidden');
                    }
                }
            });
        });
    });
});


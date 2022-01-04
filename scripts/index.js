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

    // Ajout de toutes les suggestions d'appareils/d'ustensils dans leur filtre respectif
    let appareilsList = $('#appareils')
    appareilsList.append(`<a class="dropdown-item" id="appareil_item">`+recipe.appliance+`</a>`)

    let allUstensils = recipe.ustensils.flat()
    allUstensils.forEach(

        ustensil =>{
            
            let ustensilsList = $('#ustensils')
            ustensilsList.append(`<a class="dropdown-item" id="ustensil_item">${ustensil}</a>`)
        }
    )
})

// Ajout de toutes les suggestions d'ingredients dans leur filtre respectif
document.querySelectorAll('#recipe_card_ingredient').forEach(ingredient => {
    let ingredientsList = $('#ingredients')
    ingredientsList.append(`<a class="dropdown-item" id="ingredient_item">`+ingredient.innerText+`</a>`)
})

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

// BARRE DE RECHERCHE PRINCIPALE
let mainSearchBar = document.querySelector('#search_input')
mainSearchBar.onkeyup = (e)=>{

    document.getElementById('no_result').classList.add('hidden')
    
    let userData = e.target.value; // Entrée de l'utilisateur
    let recipeCards = document.querySelectorAll('#recipe_card')
    let recipeSection = document.getElementById('recipe_deck')

    // Recherche déclenchée à partir de 3 caractères
    if (userData.length>=3){

        // Efface toutes les recettes
        for(let i =0; i<recipeCards.length;i++){
            recipeCards[i].classList.add('hidden')
        }

        // Pour chaque recette
        for (let recipe of recipes){

            // Initialise la liste d'ingrédients
            let allIngredients = []
            recipe.ingredients.forEach(ingredient => {
                allIngredients.push(ingredient.ingredient.toLowerCase())
            })

            // Pour chaque recette qui valide les conditions suivantes:
            if(
                recipe.name.toLowerCase().includes(userData) ||
                recipe.description.toLowerCase().includes(userData) ||
                allIngredients.join(' ').includes(userData)
            ){  

                // Sélectionne les recettes suivantes:
                for(let i =0; i<recipeCards.length;i++){
                    
                    // Vérifie que l'id de la recette corresponde à l'id de la recette et cache celles dont l'id ne correspond pas
                    if(recipe.id == recipeCards[i].dataset.id){
                        recipeCards[i].classList.remove('hidden')
                    }
                }
            }
        }

        // Si la section de recettes est vide (càd aucun match de recettes), le message es
        if(recipeSection.innerText == ''){
            document.getElementById('no_result').classList.remove('hidden')
        }
    }

    // Si la recherche fait moins de 2 caractères, toutes les recettes sont réapparaissent
    else if (userData.length<=2){
        for(let i =0; i<recipeCards.length;i++){
            recipeCards[i].classList.remove('hidden')
        }
    }
}

// FILTRES 
// Filtre d'ingrédient
let ingredientFilter = document.querySelector('#ingredients_filter')
ingredientFilter.addEventListener ('click', e =>{

    // Récupération de l'id des recettes présentes
    let allCardsRecipesArray = []
    currentRecipes(allCardsRecipesArray)

    // Cache tous les ingrédients de a liste du filtre d'ingrédient
    let ingredientList = document.querySelectorAll('#ingredient_item');
    for(let ingredient of ingredientList){
        ingredient.classList.add('hidden')
        ingredient.classList.remove('ingredient_filter_on')
    }
    
    // N'affiche dans le filtre que les ingrédients présents dans les recettes de la page
    let allCardRecipes = document.querySelectorAll('#recipe_card')
    allCardRecipes.forEach(card => {

        if(allCardsRecipesArray.indexOf(card.dataset.id)>-1){
            card.querySelectorAll('#recipe_card_ingredient').forEach(ingredient =>{

                for( let i=0; i<ingredientList.length; i++){
                    
                    if(ingredient.textContent === ingredientList[i].textContent){
                        ingredientList[i].classList.remove('hidden')
                        ingredientList[i].classList.add('ingredient_filter_on')
                    }
                }
            })
        }
    })
})

// Barre de recherche du filtre d'ingredient
ingredientFilter.onkeyup = (e)=>{
    let userDataIngredient = e.target.value;
    var key = e.keyCode

    let ingredientList = document.querySelectorAll('#ingredient_item');
    ingredientList.forEach(ingredient =>{

        if (key == 8 && ingredient.classList.contains('on')){
            ingredient.classList.remove('hidden')
        }

        if(!ingredient.textContent.toLowerCase().includes(userDataIngredient.toLowerCase())){
            ingredient.classList.add('hidden')
        } 
    })
}

// Ajout du tag dans la liste de tags au clic sur un ingrédient de la liste du filtre d'ingrédient
let ingredientList = document.querySelectorAll('#ingredient_item')
ingredientList.forEach(ingredientItem => {
    ingredientItem.addEventListener('click', e => {

        ingredientItem.classList.add('on_tag')

        let tagsList = $('#all_tags')
        tagsList.append(`
            <div id="ingredient_tag">`+ingredientItem.textContent+`<a id="close_tag"><i class="far fa-times-circle"></a></i><div>
        `)

        document.querySelectorAll('#recipe_card_ingredient').forEach(ingredient =>{

            if (ingredient.textContent.toLowerCase() == ingredientItem.textContent.toLowerCase()){
                ingredient.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.classList.add('ingredient_filter_on')
            } 
        })

        document.querySelectorAll('#recipe_card').forEach(card =>{

            if(!card.classList.contains('ingredient_filter_on')){
                card.classList.add('hidden')
            }
        })

        document.querySelectorAll('#close_tag').forEach(closeTag =>{
            closeTag.addEventListener('click', e =>{
                closeTag.parentNode.parentNode.removeChild(closeTag.parentNode)
                ingredientItem.classList.remove('ingredient_filter_on')

                document.querySelectorAll('#recipe_card').forEach(card =>{
                    card.classList.remove('ingredient_filter_on')
                    card.classList.remove('hidden')
                })
            })
        })
    })
})

let appareilFilter = document.querySelector('#appareil_filter')
let ustensilFilter = document.querySelector('#ustensil_filter')
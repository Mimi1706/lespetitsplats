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
            ustensilsList.append(`<a class="dropdown-item" data-id="${recipe.id}" id="ustensil_item">${ustensil}</a>`)
        }
    )
})

// Ajout de toutes les suggestions d'ingredients dans leur filtre respectif
document.querySelectorAll('#recipe_card_ingredient').forEach(ingredient => {
    let ingredientsList = $('#ingredients')
    ingredientsList.append(`<a class="dropdown-item" id="ingredient_item">`+ingredient.innerText+`</a>`)
})

// À chaque activation d'une touche du clavier
let searchInput = document.querySelector('#search_input')
searchInput.onkeyup = (e)=>{

    document.getElementById('no_result').classList.add('hidden')
    
    let userData = e.target.value; // Entrée de l'utilisateur
    let recipeCards = document.querySelectorAll('#recipe_card')
    let resultsCardsId = []

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

                // Sélectionne les recettes suivantes
                for(let i =0; i<recipeCards.length;i++){
                    
                    // Vérifie que l'id de la recette corresponde à l'id de la recette qui valide les conditions
                    if(recipe.id == recipeCards[i].dataset.id){
                        recipeCards[i].classList.remove('hidden')
                        resultsCardsId.push(recipeCards[i].dataset.id)
                    }
                }
            }
        }

        // Si la section de recettes est vide (càd aucun match de recettes)
        if(recipeSection.innerText == ''){
            document.getElementById('no_result').classList.remove('hidden')
        }
    } else if (userData.length<=2){
        for(let i =0; i<recipeCards.length;i++){
            recipeCards[i].classList.remove('hidden')
        }
    }

    // Filtres

    // Filtre d'ingrédients
    let searchIngredientInput = document.querySelector('#ingredients_filter')
    searchIngredientInput.addEventListener ('click', e =>{

        let ingredientList = document.querySelectorAll('#ingredient_item');
        for(let ingredient of ingredientList){
            ingredient.classList.add('hidden')
        }

        // N'affiche que les ingrédients présents dans les recettes de la page
        recipeCards.forEach(card => {

            if(resultsCardsId.indexOf(card.dataset.id)>-1){
                card.querySelectorAll('#recipe_card_ingredient').forEach(ingredient =>{

                    for( let i=0; i<ingredientList.length; i++){
                        
                        if(ingredient.textContent === ingredientList[i].textContent){
                            ingredientList[i].classList.remove('hidden')
                        }
                    }
                })
            }
        })

        // Barre de recherche du filtre d'ingredient
        searchIngredientInput.onkeyup = (e)=>{
            let userDataIngredient = e.target.value;
            
            let ingredientList = document.querySelectorAll('#ingredient_item');
            ingredientList.forEach(ingredient =>{

                if(!ingredient.textContent.toLowerCase().includes(userDataIngredient.toLowerCase())){
                    ingredient.classList.add('hidden')
                }
            })
        }
    })

    // Filtre d'appareils
    let searchAppareilInput = document.querySelector('#appareil_filter')
    searchAppareilInput.addEventListener ('click', e =>{

        let appareilsList = document.querySelectorAll('#appareil_item');
        for(let appareil of appareilsList){
            appareil.classList.add('hidden')
        }

        // N'affiche que les appareils présents dans les recettes de la page
        for(let recipe of recipes){

            console.log(recipe.id)
            console.log(resultsCardsId)
            console.log(resultsCardsId.indexOf(recipe.id)>-1)
        }

        // Barre de recherche du filtre d'appareil
        searchAppareilInput.onkeyup = (e)=>{
            let userDataAppareil = e.target.value;
            
            let appareilsList = document.querySelectorAll('#appareil_item');
            appareilsList.forEach(appareil =>{

                if(!appareil.textContent.toLowerCase().includes(userDataAppareil.toLowerCase())){
                    appareil.classList.add('hidden')
                }
            })
        }
    })
}

// Ajout des tags
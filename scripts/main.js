import { recipes } from "./recipes.js";

// Ajout des recettes
let recipesSection = $('#recipe_deck')
recipes.forEach(recipe => {

    recipesSection.append(`

    <div class="col-lg-4 col-md-6 col-sm-12" id="recipe_card" data-id=${recipe.id}>

    <div id="recipe_image"><img src="" class="card-img-top" alt=""></div>
    <div class="card-body">

        <div class="row d-flex align-items-center">
        <h2 class="card-title col-7">${recipe.name}</h2>
        <p class="col-5" id="recipe_time"><i class="far fa-clock"></i> ${recipe.time} min</p>
        </div>

        <div class="row">
        <ul class="col-5" id="recipe_ingredients_${recipe.id}"></ul>
        <p class="col-7" id="recipe_description">${recipe.description}</p>
        </div>

    </div>

    </div>
    `);

    // Ajout les ingrédients de chaque recette
    recipe.ingredients.forEach(ingredient =>{
        $(`#recipe_ingredients_${recipe.id}`).append(`
        <li><b>${ingredient.ingredient}</b>: ${ingredient.quantity ? ingredient.quantity : ''} ${ingredient.unit ? ingredient.unit : ''}</li>`)
    })

})

let searchInput = document.querySelector('#search_input')
searchInput.onkeyup = (e)=>{
    
    let userData = e.target.value; // Entrée de l'utilisateur

    if(userData.length>=3){

    // Efface toutes les recettes
    let recipesSection = document.getElementById('recipe_deck')
    recipesSection.innerHTML = '';

        for (let recipe of recipes){

            let allIngredients = []
            recipe.ingredients.forEach(ingredient => {
                allIngredients.push(ingredient.ingredient.toLowerCase())
            })

            let allUstensils = recipe.ustensils.flat()

            if( 
                recipe.name.toLowerCase().includes(userData) ||
                recipe.appliance.toLowerCase().includes(userData) ||
                allUstensils.join(' ').includes(userData) ||
                allIngredients.join(' ').includes(userData)
            ){
                
                // Ajoute les recettes correspondant à la recherche
                let recipesSection = $('#recipe_deck')
                recipesSection.append(`

                    <div class="col-lg-4 col-md-6 col-sm-12" id="recipe_card" data-id=${recipe.id}>

                    <div id="recipe_image"><img src="" class="card-img-top" alt=""></div>
                    <div class="card-body">

                        <div class="row d-flex align-items-center">
                        <h2 class="card-title col-7">${recipe.name}</h2>
                        <p class="col-5" id="recipe_time"><i class="far fa-clock"></i> ${recipe.time} min</p>
                        </div>

                        <div class="row">
                        <ul class="col-5" id="recipe_ingredients_${recipe.id}"></ul>
                        <p class="col-7" id="recipe_description">${recipe.description}</p>
                        </div>

                    </div>

                    </div>
                    `);

                // Ajout les ingrédients de chaque recette
                recipe.ingredients.forEach(ingredient =>{
                    $(`#recipe_ingredients_${recipe.id}`).append(`
                    <li><b>${ingredient.ingredient}</b>: ${ingredient.quantity ? ingredient.quantity : ''} ${ingredient.unit ? ingredient.unit : ''}</li>`)
                })
            } 
        }
    }
}


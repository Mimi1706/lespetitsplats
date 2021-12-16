import { recipes } from "./recipes.js";

let arrayOfIngredients = [];
let arrayOfAppareils = [];
let arrayOfUstensils = [];
let arrayOfRecipesNames = [];

recipes.forEach(
    recipe => {
        arrayOfIngredients.push(recipe.ingredients)
        arrayOfAppareils.push(recipe.appliance)
        arrayOfUstensils.push(recipe.ustensils)
        arrayOfRecipesNames.push(recipe.name)
    }
)

const allIngredients = arrayOfIngredients.map(thisRecipeIngredients => thisRecipeIngredients.map(ingredients => ingredients.ingredient));

let recipesSection = $('#recipe_deck')
    recipes.forEach(recipe => {

    recipesSection.append(`
    
    <div class="col-lg-4 col-md-6 col-sm-12 mb-3 p-3" id="recipe_card" data-id=${recipe.id}>

    <div id="recipe_image"><img src="" class="card-img-top" alt=""></div>
    <div class="card-body">

        <div class="row d-flex align-items-center">
        <h2 class="card-title col-8">${recipe.name}</h2>
        <p class="col-4" id="recipe_time"><i class="far fa-clock"></i> ${recipe.time} min</p>
        </div>

        <div class="row">
        <ul class="col-6" id="recipe_ingredients_${recipe.id}"></ul>
        <p class="col-6" id="recipe_description">${recipe.description}</p>
        </div>

    </div>

    </div>
    `);

    recipe.ingredients.forEach(ingredient =>{
        $(`#recipe_ingredients_${recipe.id}`).append(`
        <li><b>${ingredient.ingredient}</b>: ${ingredient.quantity ? ingredient.quantity : ''} ${ingredient.unit ? ingredient.unit : ''}</li>`)
    })

})
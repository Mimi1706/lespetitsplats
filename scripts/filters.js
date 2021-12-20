import { recipes } from "./recipes.js";

// Affiche toutes les suggestions d'ingredients/d'appareils/d'ustensils dans leur filtre respectif
for(let i =0; i<document.querySelectorAll('#recipe_card').length;i++){

    if(!document.querySelectorAll('#recipe_card')[i].classList.contains('hidden')){

        for(let recipe of recipes){

            if(document.querySelectorAll('#recipe_card')[i].dataset.id == recipe.id){

                // Initialise la liste d'ingrédients
                let allIngredients = []
                recipe.ingredients.forEach(ingredient => {
                    allIngredients.push(ingredient.ingredient.toLowerCase())
                })

                // Initialise la liste d'ustensils
                let allUstensils = recipe.ustensils.flat()

                // Ajoute tous les ingrédients dans la liste de filtre d'ingrédients
                allIngredients.forEach(

                    ingredient =>{
                        
                        let ingredientsList = $('#ingredients')
                        ingredientsList.append(`<a class="dropdown-item" data-id="${recipe.id}" id="ingredient_item">${ingredient}</a>`)
                    }
                )

                // Ajoute tous les ustensils dans la liste de filtre d'ustensils
                allUstensils.forEach(

                    ustensil =>{
                        
                        let ustensilsList = $('#ustensils')
                        ustensilsList.append(`<a class="dropdown-item" data-id="${recipe.id}" id="ustensil_item">${ustensil}</a>`)
                    }
                )

                // Ajoute tous les appareils dans la liste de filtre d'appareils
                let appareilsList = $('#appareils')
                appareilsList.append(`<a class="dropdown-item" data-id="${recipe.id}" id="appareil_item">${recipe.appliance}</a>`)
            }
        }
    }
}

let searchIngredientInput = document.querySelector('#ingredients_filter')
searchIngredientInput.addEventListener ('click', e =>{

    let ingredientList = document.querySelectorAll('#ingredient_item');
    for(let ingredient of ingredientList){
        ingredient.classList.add('hidden')
    }

    // Récupère les recettes présentes dans la page
    let recipeCard = document.querySelectorAll('#recipe_card')
    for(let i =0; i<recipeCard.length;i++){
        if(!recipeCard[i].classList.contains('hidden')){

            let ingredientList = document.querySelectorAll('#ingredient_item');
            for(let ingredient of ingredientList){

                // Vérifie si les ingredients du filtres correspondent avec ceux des recettes 
                if(ingredient.dataset.id == recipeCard[i].dataset.id){
                    ingredient.classList.remove('hidden')

                    // Barre de recherche du filtre
                    searchIngredientInput.onkeyup = (e)=>{
                        let userDataIngredient = e.target.value;
                        
                        ingredientList.forEach(ingredient =>{
                            if(!ingredient.text.includes(userDataIngredient)){
                                ingredient.classList.add('hidden')
                            }
                        })
                    }
                }
            }
        }     
    }
})

let searchAppareilInput = document.querySelector('#appareil_filter')
let searchUstensilInput = document.querySelector('#ustensils_filter')

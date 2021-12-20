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

// À chaque activation d'une touche du clavier
let searchInput = document.querySelector('#search_input')
searchInput.onkeyup = (e)=>{

    document.getElementById('no_result').classList.add('hidden')
    
    let userData = e.target.value; // Entrée de l'utilisateur

    // Recherche déclenchée à partir de 3 caractères
    if (userData.length>=3){

        // Efface toutes les recettes
        for(let i =0; i<document.querySelectorAll('#recipe_card').length;i++){
            document.querySelectorAll('#recipe_card')[i].classList.add('hidden')
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
                for(let i =0; i<document.querySelectorAll('#recipe_card').length;i++){
                    // Vérifie que l'id de la recette corresponde à l'id de la recette qui valide les conditions
                    if(recipe.id == document.querySelectorAll('#recipe_card')[i].dataset.id)
                    document.querySelectorAll('#recipe_card')[i].classList.remove('hidden')
                }
            }
        }

        // Si la section de recettes est vide (càd aucun match de recettes)
        if(document.getElementById('recipe_deck').innerText == ''){
            document.getElementById('no_result').classList.remove('hidden')
        }
    }

    // Si l'entrée est inférieure à 2 caractères, on montre toutes les recettes
    else if(userData.length<=2){
        for(let i =0; i<document.querySelectorAll('#recipe_card').length;i++){
            document.querySelectorAll('#recipe_card')[i].classList.remove('hidden')
        }
    }
}
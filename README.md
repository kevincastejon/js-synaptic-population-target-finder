# js-synaptic-population-target-finder

<img src="public/brFlag.png" width="15px" /> An evolving neural network teaching foxes to walk to the chicken! This a is usage example of [synaptic-population](https://www.npmjs.com/package/synaptic-population) package.

<img src="public/frFlag.png" width="15px" /> Un réseau de neurones évolutif apprenant aux renards à attraper la poule! Ceci est un exemple d'utilisation du module [synaptic-population](https://www.npmjs.com/package/synaptic-population).



## Online Demo

[Online demo : https://kevincastejon.fr/demos/deep-learning-demo-target-finder/](https://kevincastejon.fr/demos/deep-learning-demo-target-finder/)

## <img src="public/brFlag.png" width="25px" /> How it works
## <img src="public/frFlag.png" width="25px" /> Fonctionnement

<img src="public/brFlag.png" width="15px" /> Each fox begins with a random brain and the only information given when activating neurons is their distance to the chicken, with no idea of what to do (get the chicken) nor how to do it (send correct outputs to walk to him). They then evolve at each generation and begin to "learn" how to accomplish their task.

<img src="public/frFlag.png" width="15px" /> Chaque renard commence avec un cerveau aléatoire et la seule information fournie lors de l'activation des neurones est leur distance à la poule, sans aucune idée de quoi faire (attraper la poule) ni de comment le faire (fournir les sorties correctes pour marcher vers la poule). Puis ils évoluent à chaque génération et commencent à "apprendre" comment accomplir leur tâche.

## <img src="public/brFlag.png" width="25px" /> Evolution process
## <img src="public/frFlag.png" width="25px" /> Processus évolutif

<img src="public/brFlag.png" width="15px" /> Instead of "learning" by giving datasets and using backpropagation, this project use an approach imitating the evolution. Start with random brains, let them play the game following their outputs, determine a score for each brain, then sort them by this score. Keep the bests brains, drop the others and replace them by crossovers (children) of the bests and mutate the children.

<img src="public/frFlag.png" width="15px" /> Plutôt que "d'apprendre" en fournissant un jeu de données et en utilisant la backpropagation, ce projet utilise une approche imitant l'évolution. Commencer avec des cerveaux aléatoires, les laisser jouer, determiner un score pour chaque cerveau, puis les trier par ce score. Garder les meilleurs, abandonner les autres et les remplacer par des croisements (enfants) des meilleurs et muter les enfants.

## Installation

```bash
git clone https://github.com/kevincastejon/js-synaptic-population-target-finder
cd js-synaptic-population-target-finder
npm i
```

## Run

```bash
npm start
```

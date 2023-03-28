import React, { useEffect, useRef, useState } from 'react'
import pokedex from './images/Pokedex.png';

interface IPokemon {
    name: string,
    image: string,
    type: string,
    features: string[],
    description: string
}

let pokemons: IPokemon[] = [
    {
        name: "Nombre: Pikachu",
        image: require("./images/pokemon-1.jpg"),
        type: "Tipo: Eléctrico",
        features: ["Electricidad", "Estática", "Pararrayos", "Especie: Pokémon Ratón"],
        description: "Descripción: Su nombre proviene de la unión de las palabras en japonés pika, que es el nombre de un lagomorfo (el orden al que pertenecen conejos y liebres) de origen en Norteamérica y Asia, los ochotónidos o de pikapika, la onomatopeya japonesa que describe las chispas eléctricas, y chuchu, onomatopeya japonesa del sonido producido por un un ratón, para darle un sonido tierno."
    },
    {
        name: "Nombre: Charmander",
        image: require("./images/pokemon-2.jpg"),
        type: "Tipo: Fuego",
        features: ["Mar llamas", "Poder solar", "Especie: Pokémon Lagartija"],
        description: "Descripción: Su nombre es una contracción de las palabras en inglés charcoal (carbón) y salamander (salamandra). Su nombre japonés, Hitokage, proviene de 火蜥蜴 (salamandra de fuego), siendo 火 hi 'fuego' y 蜥蜴 tokage 'lagarto'. Su nombre francés, Salameche, proviene de las palabras en francés salamandre (salamandra) y mèche (mecha)."
    },
    {
        name: "Nombre: Bulbasaur",
        image: require("./images/pokemon-3.jpg"),
        type: "Tipo: Planta, Veneno",
        features: ["Espesura", "Clorofila", "Especie: Pokémon Semilla"],
        description: "Descripción: Bulbasaur es un Pokémon cuadrúpedo de color verde y manchas más oscuras de formas geométricas. Su cabeza representa cerca de un tercio de su cuerpo. En su frente se ubican tres manchas que pueden cambiar dependiendo del ejemplar. Tiene orejas pequeñas y puntiagudas. Sus ojos son grandes y de color rojo. Las patas son cortas con tres garras cada una. Este Pokémon tiene plantado un bulbo en el lomo desde que nace. Esta semilla crece y se desarrolla a lo largo del ciclo de vida de Bulbasaur a medida que suceden sus evoluciones. El bulbo absorbe y almacena la energía solar que Bulbasaur necesita para crecer."
    }
];

interface IPokedex {
    width: number
    height: number
    scale: number
    x: number
    y: number
}

const Canvas = (props: any) => {
  
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isInit = useRef<boolean>(false);
    const pokedexProps = useRef<IPokedex | null>(null);
    const pokemonImageGlobal = useRef<HTMLImageElement | null>(null);
    const currentPokemon = useRef<number>(0);    

    const loadFisrtImage = (size: IPokedex, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
        return new Promise((resolve: any, reject: any) => {
            // Obtener el ancho y alto del canvas y de la imagen
            const rectangleWitdh = 544;
            const rectangleHeight = 363;

            //-----------------------------------------------
            //-----------------------------------------------
            // Crear una nueva imagen
            let pokemonImage = new Image();
            pokemonImage.src = pokemons[currentPokemon.current].image;

            pokemonImageGlobal.current = pokemonImage;
            
            /*----------------------------- */
            let pokemon = pokemons[currentPokemon.current];

            const x_text = size.x + (813 * size.scale);
            const y_text = size.y + (260 * size.scale);
            
            const width_text = 567 * size.scale;
            const height_text = 314 * size.scale;
            
            ctx.font = '30px Arial';
            ctx.fillStyle = '#fff'; // establecer el color de relleno en negro
            ctx.fillText(pokemon.name, x_text + 10, y_text + 30);
            
            ctx.font = '16px Arial';
            ctx.fillText(pokemon.type, x_text + 10, y_text + 55);

            let initX: number = 10;
            let initY: number = 80;

            pokemon.features.forEach((feature: string) => {
                ctx.fillText(feature, x_text + initX, y_text + initY);
                initY+= 20;

                if(initY > 130){
                    initY = 80;
                    initX += 210;
                }
            });

            fillText(ctx, pokemon.description, x_text + 10, y_text + 150, width_text-10, 20);
            /*----------------------------- */

            pokemonImage.onload = () => {
                /*------- Dibujar imágen -------*/
                const imageWidth = pokemonImage.width;
                const imageHeight = pokemonImage.height;

                const scaleRectangle = Math.min(rectangleWitdh/imageWidth, rectangleHeight/imageHeight);
        
                // Calcular el ancho y alto de la imágen escalada
                const scaledWidth = imageWidth * size.scale * scaleRectangle;
                const scaledHeight = imageHeight * size.scale * scaleRectangle;

                const x = size.x + (74 * size.scale);
                const y = size.y + (216 * size.scale);

                roundedImage(ctx, x, y, scaledWidth, scaledHeight, 5);
                ctx.strokeStyle = '#007470'
                ctx.stroke()
                ctx.clip();
        
                ctx.drawImage(pokemonImage, x, y, scaledWidth, scaledHeight);
                
                resolve();
            }

            pokemonImage.onerror = () => {
                reject();
            }
        });
    }

    const fillText = (ctx: any, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
        let words = text.split(' ');
        let line = '';
      
        for (let i = 0; i < words.length; i++) {
          let testLine = line + words[i] + ' ';
          let testWidth = ctx.measureText(testLine).width;
          if (testWidth > maxWidth && i > 0) {
            ctx.fillText(line, x, y);
            line = words[i] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, y);
      }
    

    const roundedRectangle = (ctx: any, rectX: number, rectY: number, rectWidth: number, rectHeight: number, borderRadius: number)=> {
        // Dibujar el borde redondeado del rectángulo
        ctx.beginPath();
        ctx.moveTo(rectX + borderRadius, rectY);
        ctx.lineTo(rectX + rectWidth - borderRadius, rectY);
        ctx.arc(rectX + rectWidth - borderRadius, rectY + borderRadius, borderRadius, -Math.PI / 2, 0);
        ctx.lineTo(rectX + rectWidth, rectY + rectHeight - borderRadius);
        ctx.arc(rectX + rectWidth - borderRadius, rectY + rectHeight - borderRadius, borderRadius, 0, Math.PI / 2);
        ctx.lineTo(rectX + borderRadius, rectY + rectHeight);
        ctx.arc(rectX + borderRadius, rectY + rectHeight - borderRadius, borderRadius, Math.PI / 2, Math.PI);
        ctx.lineTo(rectX, rectY + borderRadius);
        ctx.arc(rectX + borderRadius, rectY + borderRadius, borderRadius, Math.PI, -Math.PI / 2);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#471553';
        ctx.stroke();

        // Rellenar rectángulo con color de fondo
        ctx.fillStyle = '#471553';
        ctx.fill();
    }

    const roundedImage = (ctx: any, x: number, y: number, width: number, height: number, radius: number)  => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      }

    const drawImage = () => {
        if(canvasRef?.current){
            const canvas: HTMLCanvasElement = canvasRef.current;
            const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");  

            if(ctx){
                // Crear una nueva imagen
                const image = new Image();
                image.src = pokedex;

                const drawImagePokemon = () => {
                    canvas.width = canvas.offsetWidth;
                    canvas.height = canvas.offsetHeight;

                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    // Obtener el ancho y alto del canvas y de la imagen
                    const canvasWidth = canvas.width;
                    const canvasHeight = canvas.height;

                    const imageWidth = image.width;
                    const imageHeight = image.height;
            
                    // Calcular el factor de escala
                    const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);

                    
                    // Calcular el ancho y alto de la imagen escalada
                    const scaledWidth = imageWidth * scale;
                    const scaledHeight = imageHeight * scale;
                    
                    // Calcular la posición x e y de la imagen dentro del canvas
                    const x = (canvasWidth - scaledWidth) / 2;
                    const y = (canvasHeight - scaledHeight) / 2;

                    let props = {
                        width: imageWidth, 
                        height: imageHeight,
                        x: x,
                        y: y,
                        scale: scale
                    };
                    
                    pokedexProps.current = props;  

                    ctx.drawImage(image, x, y, scaledWidth, scaledHeight);

                    // Dibujar borde redondo del rectángulo de fondo del textp
                    const x_text = props.x + (813 * props.scale);
                    const y_text = props.y + (260 * props.scale);
                    
                    const width_text = 567 * props.scale;
                    const height_text = 373 * props.scale;

                    roundedRectangle(ctx, x_text, y_text, width_text, height_text, 20);
            
                    // Dibujar primera imágen
                    loadFisrtImage(props, canvas, ctx);
                };
        
                // Esperar a que la imagen se cargue
                // Esperar a que la imagen se cargue
                image.onload = () => {
                    // Función para dibujar la imagen en el canvas
                    
            
                    // Dibujar la imagen en el canvas al cargar la página
                    drawImagePokemon();
            
                    // Volver a dibujar la imagen en el canvas cuando se produzca un cambio en el tamaño
                    window.addEventListener("resize", drawImagePokemon);
                };

                image.onerror = () => {
                    drawImagePokemon();
                }
            
                // Eliminar el evento "resize" cuando se desmonte el componente
                return () => {
                    window.removeEventListener("resize", drawImagePokemon);
                };
            }    
        }
    }

    const changePokemon = () => {
        if(pokemonImageGlobal.current && canvasRef.current){
            const canvas: HTMLCanvasElement = canvasRef.current;
            
            const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");  

            /*if(ctx){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                pokemonImageGlobal.current.src = pokemons[currentPokemon.current].image;
            }*/

            drawImage();
        }
    }

    const nextImage = () => {
        if(currentPokemon.current + 1 < pokemons.length){
            currentPokemon.current = currentPokemon.current+1;
        } else {
            currentPokemon.current = 0;
        }

        changePokemon();
    }
    
    const previousImage = () => {
        if(currentPokemon.current - 1 < 0){
            currentPokemon.current = pokemons.length-1;
        } else {
            currentPokemon.current = currentPokemon.current-1;
        }

        changePokemon();
    }

    useEffect(() => {
        if(!isInit.current && pokedexProps){
            isInit.current = true;

            drawImage();

            if(canvasRef?.current){
                const canvas: HTMLCanvasElement = canvasRef.current;
    
                canvas.addEventListener('click', (event) => { 
                    if(pokedexProps.current){
                        // Cambiar a la proxima imagen
                        let x1 = (558 * pokedexProps.current.scale) + pokedexProps.current.x, x2 = (592 * pokedexProps.current.scale) + pokedexProps.current.x;
                        let y1 = (680 * pokedexProps.current.scale) + pokedexProps.current.y, y2 = (722 * pokedexProps.current.scale) + pokedexProps.current.y;
    
                        if( event.x >= x1 && event.x <= x2 && event.y >= y1 && event.y < y2 ){                        
                            nextImage();
                        }
    
                        // Cambiar a la anterior imagen
                        x1 = (477 * pokedexProps.current.scale) + pokedexProps.current.x;
                        x2 = (514 * pokedexProps.current.scale) + pokedexProps.current.x;
    
                        if( event.x >= x1 && event.x <= x2 && event.y >= y1 && event.y < y2 ){
                            previousImage();
                        }
                    }
                }, false);
            }
        }
    }, []);
    

    return <div style={{width: "100%", height: "100%"}}>
        <canvas className="canvas-pokedex" ref={canvasRef} />
    </div>;
  }

export default Canvas
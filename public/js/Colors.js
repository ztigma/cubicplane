const colors =
{
    azul:'#0B3C49'
    ,
    morado:'#731963'
    ,
    blanco:'#FFFDFD'
    ,
    gris:'CBD2D0'
    ,
    amarillo:'F0E100'
}
class Backgrounds extends Interfaz
{
    constructor(path)
    {
        super();

        if(path == undefined)
        {
            path = '';
        }

        this.cv = path + 'public/img/cv.pdf';

        this.profile = path + 'public/img/profile.pdf';

        this.pared = path + 'public/img/pared.jpg';

        this.img_part_piso = path + 'public/img/piso_tile.webp';

        this.madera = path + 'public/img/madera.jpeg';

        this.tienda = path + 'public/img/tienda.jpg';

        this.lineas_tile = path + 'public/img/lineas_tile.webp';

        this.santa_maria = 
        'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiG8XiJBt5g1LoVqVuVf2k6Bm9Lf6Mi-5cOAsfFDDH5DGUUqWWa_BiNnvnvenUW73ja1YB3jtwODk0bknyvUca4mG0yma1scj0fibSnQ_tP3Nuds1DY2DRQUiOFh9iYDXeyKnYsMZhEZfXeknyg28mxMUx621CjSv20wZy2UqBGshjTRWWSX4pA8Q/s16000/metal_pull_down_shutter_texture_p.jpeg'
        ;

        this.img_part_piso2 = 
        'https://static.vecteezy.com/system/resources/previews/008/383/986/original/abstract-seamless-pattern-of-orange-white-ceramic-floor-tiles-design-geometric-mosaic-texture-for-the-decoration-of-the-kitchen-room-illustration-free-vector.jpg';
        ;
    }
    Start()
    {
        document.body.innerHTML = document.body.innerHTML.PROPS(this);      
    }
}
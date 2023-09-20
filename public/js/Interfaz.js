/**
 * soy una interfaz para trabajar y para comunicar
 */
class Interfaz
{
    constructor()
    {
        AddStart(this);
        AddUpdate(this);
    }
    Start()
    {

    }
    Update()
    {

    }
    /**
     * 
     * @param {CollisionResult} collision 
     */
    OnCollisionStay(collision)
    {
        
    }
    /**
     * 
     * @param {CollisionResult} collision 
     */
    OnCollisionEnter(collision)
    {
        
    }
    /**
     * 
     * @param {CollisionResult} collision 
     */
    OnCollisionExit(collision)
    {

    }
}
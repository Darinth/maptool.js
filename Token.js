function getPlayerName()
{
	return ;
}

class Token
{
    constructor(maptoolToken) {
        this.maptoolToken = maptoolToken;
		//MapTool.chat.broadcast(this.maptoolToken.toString());
		//MapTool.chat.broadcast(this.maptoolToken.getId().toString());
    }

    static getTokenById(id) {
		//MapTool.chat.broadcast(MapTool.tokens.getTokenByID(id).toString());
        
        return new Token(MapTool.tokens.getTokenByID(id))
    }

    static getSelectedTokens() {
       	return Array.from(MapTool.tokens.getSelectedTokens()).map(mtToken => new Token(mtToken.getId()));
    }
    
    getX(){
        return this.maptoolToken.getX();
    }

    getY(){
        return this.maptoolToken.getY();
    }

    isOwner(owner){
        internalOwner = owner != undefined ? owner : MTScript.evalMacro("[r: getPlayerName()]");
        return this.maptoolToken.isOwner(internalOwner);
    }

    setX(x){
        return this.maptoolToken.setX(x);
    }

    setY(y){
        return this.maptoolToken.setY(y);
    }

    setNotes(notes){
        return this.maptoolToken.setX(notes);
    }

    getNotes(){
        return this.maptoolToken.getNotes();
    }

    hasSight(){
        return this.maptoolToken.hasSight();
    }

    setSight(sight){
        return this.maptoolToken.setSight(sight);
    }

    getName(){
        return this.maptoolToken.getName();
    }

    getProperty(property){
        return "" + MTScript.evalMacro('[r: getProperty("' + property + '", "' + this.getId() + '")]');
        //return this.maptoolToken.getProperty(property);
    }

    setProperty(property, value){
        return this.maptoolToken.setProperty(property, value);
    }

    setName(name){
        return this.maptoolToken.setName(name);
    }

    getId(){
        return this.maptoolToken.getId();
    }

    setState(state, value){
        MTScript.evalMacro('[r: setState("' + state + '", ' + value + ', ' + this.getId() + ')]');
    }
}

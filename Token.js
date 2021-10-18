// Map with WeakRef-wrapped values and a FinalizationRegistry
// Created by Justin Bradform and used under MIT License
// Looking more and more like putting all of this in a proper yarn repo with webpacker may be useful...
class WeakValueMap extends Map {
    constructor() {
        super()
        this.finalizer = new FinalizationRegistry(
            key => super.delete(key)
        )
    }

    get(key) {
        const ref = super.get(key)
        const value = ref && ref.deref()

        // remove entry if reference is no longer valid
        if (ref && !value) super.delete(key)

        return value
    }

    #unregister(ref) {
        const value = ref && ref.deref()
        if (value) this.finalizer.unregister(value)
    }

    set(key, value) {
        // unregister finalizer if an existing value
        this.#unregister(super.get(key))

        // register finalizer for the new value
        this.finalizer.register(value, key, value)

        // store a weak reference to the value
        super.set(key, new WeakRef(value))
        return this
    }

    delete(key) {
        // unregister finalizer if an existing value
        this.#unregister(super.get(key))

        return super.delete(key)
    }

    clear() {
        // unregister finalizer for existing values
        for (const ref of super.values()) this.#unregister(ref)

        return super.clear()
    }
}

function getPlayerName()
{
	return ;
}

class Token
{
    static #wm = new WeakValueMap()

    constructor(maptoolToken) {
        this.maptoolToken = maptoolToken;
		//MapTool.chat.broadcast(this.maptoolToken.toString());
		//MapTool.chat.broadcast(this.maptoolToken.getId().toString());
        this.barsProxy = new Proxy({}, {
            get: this.#getBarProxy.bind(this),
            set: this.#setBarProxy.bind(this)
        });

        this.statesProxy = new Proxy({}, {
            get: this.#getStateProxy.bind(this),
            set: this.#setStateProxy.bind(this)
        });
    }

    static retrieveToken(maptoolToken) {
        let token = Token.#wm.get(maptoolToken);
        if(token === undefined)
        {
            token = new Token(maptoolToken);
            Token.#wm.set(maptoolToken, token);
        }
        return token;
    }

    static getTokenById(id) {
		//MapTool.chat.broadcast(MapTool.tokens.getTokenByID(id).toString());
        
        return Token.retrieveToken(MapTool.tokens.getTokenByID(id));
    }

    static getTokenByName(tokenName) {
        let id = MTScript.evalMacro(`[r: findToken("${tokenName.replace('"','')}")]`);
        if(id === "") throw "Token not found";
        return Token.getTokenById(id);
    }

    static get selectedTokens() {
       	return Array.from(MapTool.tokens.getSelectedTokens()).map(mtToken => retrieveToken(mtToken));
    }

    static get selectedToken() {
        return retrieveToken(MapTool.tokens.getSelected());
    }
    
    get x(){
        return this.maptoolToken.getX();
    }

    get y(){
        return this.maptoolToken.getY();
    }

    isOwner(owner){
        internalOwner = owner != undefined ? owner : MTScript.evalMacro("[r: getPlayerName()]");
        return this.maptoolToken.isOwner(internalOwner);
    }

    set x(x){
        return this.maptoolToken.setX(x);
    }

    set y(y){
        return this.maptoolToken.setY(y);
    }

    set notes(notes){
        return this.maptoolToken.setNotes(notes);
    }

    get notes(){
        return this.maptoolToken.getNotes();
    }

    hasSight(){
        return this.maptoolToken.hasSight();
    }

    set sight(sight){
        return this.maptoolToken.setSight(sight);
    }

    get name(){
        return this.maptoolToken.getName();
    }

    getProperty(property){
        return "" + MTScript.evalMacro(`[r: getProperty("${property.replace('"','')}", "${this.id}")]`);
        //return this.maptoolToken.getProperty(property);
    }

    setProperty(property, value){
        //TODO: Switch this method to return a proxy object. Current syntax to use is myToken.setProperty("strength", 10) final syntax will be something akin to myToken.properties.strength = 10
        return this.maptoolToken.setProperty(property, value);
    }

    set name(name){
        return this.maptoolToken.setName(name);
    }

    get id(){
        return this.maptoolToken.getId();
    }

    get bars(){
        return this.barsProxy;
    }

    #getBarProxy(target, bar, receiver){
        return "" + MTScript.evalMacro(`[r: getBar("${bar.replace('"','')}", "${this.id}")]`);
    }

    #setBarProxy(target, bar, value, receiver) {
        MTScript.evalMacro(`[r: setBar("${bar.replace('"','')}", ${value}, "${this.id}")]`);
        return;
    }

    get states(){
        return this.statesProxy;
    }

    #getStateProxy(target, state, receiver){
        return (("" + MTScript.evalMacro(`[r: getState("${state.replace('"','')}", "${this.id}")]`)) === "1");
    }

    #setStateProxy(target, state, value, receiver) {
        MTScript.evalMacro(`[r: setState("${state.replace('"','')}", ${value ? 1 : 0}, "${this.id}")]`);
        return;
    }
}

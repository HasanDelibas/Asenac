"use strict";
//#region All Platform Lib
declare interface Array<T>{
	/**
	 * Pop element of array
	 * @param index Number of pop index, default last element pop
	 */
	popAt(index?:number):T;
	/**
	 * Return Last Element Of List
	 */
	last:T

	/**
	 * Return unique variables with new array
	 */
	unique():Array<T>
	/**
	 * Removes Same Variables
	 */
	distinct( fn?:(a:T,b:T)=>boolean )
}
//@ts-ignore
Array.prototype.popAt = function(index:number) {
    if(index==null){
        index = this.length - 1;
    }
    return this.splice(index,1)[0];   
}

Array.prototype.unique = function() {
	function onlyUnique(value,index,self){
		return self.indexOf(value) === index;
	}
	return this.filter(onlyUnique);
}

Array.prototype.distinct = function(this:Array<any>,fn:(a:any,b:any)=>boolean=(a,b)=>{return a==b}){
	let i = 0;
	for (i = 0; i < this.length; i++) {
		const element = this[i];
		let find = this.filter( e=>{ return fn(element,e) } );
		for (let j = 1; j < find.length; j++) {
			const element = find[j];
			this.popAt( this.indexOf(element) )
		}
	}

}


declare interface String{
	replaceAll(search:RegExp | String,replacement:string):string;
	trimQuotes():string;

	/**
	 * Search requirsively charcater, if found: return
	 * * [0] : start + founded + end
	 * * [1] : founded
	 * * [2] : start index
	 * * [3] : end index
	 * @param start start character ( { [
	 * @param end end character ) } ]
	 * @param position start position search
	 */
	matchRequirsive(start:string,end:string,position?:number):null|Array<string>

	/**
	 * Return removed sub string
	 * **Example**
	 * * "String".pop(1,1) = **"Sring"**
	 * * Inverse of substring
	 * @param start 
	 * @param length 
	 */
	pop(start:number,length:number)


	/**
	 * Split text outer chars
	 * Ex: splitOuter ( '\n' , ['{','['] , ['}',']']  )
	 * @param splitter 
	 * @param start 
	 * @param end 
	 */
	splitOuter(splitter:string,start:string[],end:string[]);
		/**
	 * Split text outer chars
	 * Ex: splitOuter ( '\n' , '{' , '}' );
	 * @param splitter 
	 * @param start 
	 * @param end 
	 */
	splitOuter(splitter:string,start:string,end:string);
}

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
}



// "" tırnak işaretlerini siler
String.prototype.trimQuotes = function(){
	var str = this;
	str = str.trim();
	if(str[0]=="\"" || str[0] == "'" )
		str = str.substr(1)
	if(str[str.length-1]=="\"" || str[str.length-1] == "'" )
		str = str.substr(0,str.length-1)
	return str;
};


String.prototype.matchRequirsive = function(start:string,end:string,position:number=0):null|Array<string>{
	var search = this;
    var total = 0,startLen = start.length, endLen = end.length;
    var startPoint = -1;
    for (let i = position; i < search.length - endLen+1; i++) {
        const element = search[i];
        //console.log(i,element,total,startPoint);
        if( search.substr(i,startLen) == start ){
            //console.log("S:",i)
            total++;
			if(startPoint==-1) startPoint = i;
			i+=startLen - 1;
        }
        if( search.substr(i,endLen) == end){
            //console.log("E:",i)
			total--;
			
			
            if(total==0 && startPoint!=-1){
                return [
                    search.substr(startPoint,i+endLen-startPoint),
					search.substr(startPoint+startLen , i - startPoint - startLen),
					startPoint+startLen,
					i + endLen
                ]
			}
			i+=endLen - 1;
        }
    }
    return null;
}

String.prototype.pop = function (this:string, start:number,length:number) {
	return this.substr(0,start) + this.substr(start+length);
}

String.prototype.splitOuter = function (this:string,splitter:string,start:string|string[],end:string|string[]) {
	if(typeof start=="string") start = [start];
	if(typeof end=="string") end = [end];	

	var str = this;
	var mCount = arrays(start.length,0);
	var sLens = start.map(e=>e.length);
	var splitterLength = splitter.length;

	var list = [];
	var splitPoint = 0;
	let canSplit = true;
	for (let i = 0; i < str.length; i++) {
		canSplit = true;
		for (let j = 0; j < start.length; j++) {
			const _sEl = start[j];
			const _eEl = end[j];

			if( str.substr(i, sLens[j] )==_sEl ){
				mCount[j]++;
			}
			if( str.substr(i, sLens[j] )==_eEl ){
				mCount[j]--;
			}
			if(mCount[j]!=0) canSplit=false;
		}
		
		if( canSplit && str.substr(i,splitterLength)==splitter ){
			list.push(
				str.substr(splitPoint,i-splitPoint)
			);
			splitPoint=i+1;
		}
	}
	list.push(
		str.substr(splitPoint)
	);
	return list;
}


declare interface Number{
	/**
	 * Return x digit string
	 * * (1).toDigit(2)  => "01"
	 * * (14).toDigit(3) => "014"
	 * @param x Number of digit
	 */
	toDigit(x:number):string
}


Number.prototype.toDigit = function(x){
	var str = this.toString();
	var len = str.length;
	for( ; x>len ; len++){
	  str="0"+str;
	}
	return str;
  }




// MATH BASICS
/**
 * return a array
 * @param start 
 * @param end 
 */
const range = function(start:number,end:number):Array<number>{
	var ret = []
	for(let i = start ; start<end ? i<=end : i>=start; start<end? i++: i--)
		ret.push(i)
	return ret;
}

const arrays = function (count:number,value:number=0) {
	var ret = [];
	for (let i = 0; i < count; i++) {
		ret.push(value);
	}
	return ret;
}

/**
 * positive range
 * return a array
 * @param start 
 * @param end 
 */
const prange = function(start:number,end:number):Array<number>{
	var ret = []
	for(let i = start ; i<=end ; i++)
		ret.push(i)
	return ret;
}
/**
 * negative return a array
 * @param start 
 * @param end 
 */
const nrange = function(start:number,end:number):Array<number>{
	var ret = []
	for(let i = start ; i>=start; i--)
		ret.push(i)
	return ret;
}


const val = function(data,def){
	if(data!=null) return data;
	return def;
}

/** ================= cval ================= */
function cval(obj:any,arr:Array<string|number|symbol>,defVal?:any):any{
	if(defVal===undefined)
		defVal = cval.defValue;
	if(obj==null){
		return defVal;
	}
	if(arr.length==0){
		return obj;
	}else {
		var index = arr.popAt(0);
		if( typeof(obj) =="object" &&  index in obj ){
			return cval(obj[index],arr,defVal)
		}else{
			return defVal;
		}
	}
}
cval.defValue = null;

if(typeof process!="undefined")
	globalThis.cval = cval;

/**
 * Convert json to href\n
 *	Example
 * 	url: user
 *  parameters: {name:"Hasan"}
 * 	user?name=Hasan
 * @param url
 * @param parameters 
 */
function $H(url:string, parameters:object):string{
	var qs = "";
	for(var key in parameters) {
	  var value = parameters[key];
	  qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
	}
	if (qs.length > 0){
	  qs = qs.substring(0, qs.length-1); //chop off last "&"
	  url = url + "?" + qs;
	}
	return url;
}

/**
	Tree Hierarchy

	_id			:number
	_children	:list
	_text		:string
	_data		:storage data

 */

/**
 * 
 * @param {*} tree Tree mechanzim.
 * @param {*} fn Function <item, text[], id[]> return boolean
 * @param {*} ret Function <item, text[], id[]>
 */
function TreeFilter(tree,fn,ret) {
    if(ret==null) ret = e=> e;
    let retList = [];
    TreeFilterReq(tree,[],[] )

    function TreeFilterReq(tree,textList,idList) {
        for (let i = 0; i < tree.length; i++) {
            const element = tree[i];

            if( fn(
                    element,
                    [].concat(textList,element._text) ,
                    [].concat(idList,element._id)
                )) {
                retList.push( ret( element,
                    [].concat(textList,element._text) ,
                    [].concat(idList,element._id)
                ))
            }

            if( typeof(element)=="object" && element!=null && "_children" in element ){
                TreeFilterReq(element._children, 
                    [].concat(textList,element._text) ,
                    [].concat(idList,element._id) 
                )
            }
        }
        
    }
    return retList;
}
if(typeof process!="undefined")
	globalThis.TreeFilter = TreeFilter;

//#endregion


//#region Browser Functions
declare interface Element{
	/**
	 * Remove Element
	 */
	remove()
	/**
	 * Remove All Child Elements
	 */
	empty()
}
declare interface DocumentFragment{

	/**
	 * Remove All Child Elements
	 */
	empty()
}


if (typeof window !== 'undefined'){
	const Append = function(parent:Element,child:Array<Element> | Object | Element ){
		if(child instanceof Array){
			let fragment = document.createDocumentFragment();
	
			for (let i = 0; i < child.length; i++) {
				const element = child[i];
				console.log(element)
				fragment.appendChild(element)
			}
			console.log(fragment)
			parent.append(fragment)
		}
		if(child instanceof Object){
			var keys = Object.keys(child);
			for (let i = 0; i < keys.length; i++) {
				const element = child[keys[i]];
				if(element instanceof Element){
					parent.appendChild(element)
				}
			}
		}
		if(child instanceof Element){
			parent.appendChild(child)
		}
		if(child instanceof Text){
			parent.appendChild(child)
		}
	}
	
	

	
	DocumentFragment.prototype.empty = function (this:DocumentFragment) {
		for (let i = 0; i < this.childNodes.length; i++) {
			const element = this.childNodes[i];
			this.removeChild(element)
		}
	}
	
	Element.prototype.remove = function(this:Element){
		this.parentElement.removeChild(this)
	}
	Element.prototype.empty = function(this:Element){
		while(this.childNodes.length>0){
			this.firstChild.remove()
		}
	}
	
}

//#endregion

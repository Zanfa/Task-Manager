function define (namespace) {
    var i, steps, 
        currentPackage = window;

    steps = namespace.split('.');
    for (i = 0; i < steps.length; i++) {
        if (typeof currentPackage[steps[i]] === 'undefined')
            currentPackage[steps[i]] = {};
        
        currentPackage = currentPackage[steps[i]];
    }
}

function extend (parent, prototype) {
    var newPrototype, property;
    prototype = prototype || {};
    
    if (typeof Object.create === 'undefined') {
        newPrototype = (function (proto) {
            function F() {}
            F.prototype = proto;
            return new F();
        }) (parent.prototype);
    } else
        newPrototype = Object.create(parent.prototype);
    
    for (property in prototype) {
        if (!prototype.hasOwnProperty(property))
            return;
            
        newPrototype[property] = prototype[property];
    }
    
    return newPrototype;
}
    

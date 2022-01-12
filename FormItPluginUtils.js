if (typeof FormIt.PluginUtils == 'undefined')
{
    FormIt.PluginUtils = {};
}

// this script is designed to be used both in the web and FormIt application context
// but because the FormIt context doesn't support ES6 syntax,
// this script must use var and no async/await

//
// math utils
//
FormIt.PluginUtils.Math = FormIt.PluginUtils.Math || {};

// get the distance between two points [x,y,z]
FormIt.PluginUtils.Math.getDistanceBetweenTwoPoints = function(x0,y0,z0, x1,y1,z1)
{
    var distance = Math.sqrt((Math.pow((x1-x0),2)) + (Math.pow((y1-y0),2)) + (Math.pow((z1-z0),2)));
    //console.log("Distance: " + distance);
    return distance;
}

// get the midpoint between two points defined by an array [x,y,z]
FormIt.PluginUtils.Math.getMidPointBetweenTwoPoints = function(x0,y0,z0, x1,y1,z1)
{
    var x = (x0 + x1) / 2;
    var y = (y0 + y1) / 2;
    var z = (z0 + z1) / 2;

    var midPoint = new Array(x, y, z);
    // returns [x,y,z]
    return midPoint;
    //console.log(midPoint);
}

// get the vector between two points [x,y,z]
FormIt.PluginUtils.Math.getVectorBetweenTwoPoints = function(x0,y0,z0, x1,y1,z1)
{
    var vector = new Array(x1-x0, y1-y0, z1-z0);
    return vector;
}

// get the magnitude of a vector
FormIt.PluginUtils.Math.getVectorMagnitude = function(vector)
{
    var vectorMagnitude = Math.sqrt((vector[0] * vector[0]) + (vector[1] * vector[1]) + (vector[2] * vector[2]));
    return vectorMagnitude;
}

// get the normalized vector between two points [x,y,z]
FormIt.PluginUtils.Math.getNormalizedVectorBetweenTwoPoints = function(x0,y0,z0, x1,y1,z1)
{
    var magnitude = getDistanceBetweenTwoPoints(x0,y0,z0, x1,y1,z1)
    var vector = new Array((x1-x0)/magnitude, (y1-y0)/magnitude, (z1-z0)/magnitude);
    return vector;
}

// get the cross product of two vectors
FormIt.PluginUtils.Math.crossProductVector = function(vector0, vector1)
{
    var crossProductVectorX = (vector0[1]*vector1[2] - vector0[2]*vector1[1]);
    var crossProductVectorY = (vector0[2]*vector1[0] - vector0[0]*vector1[2]);
    var crossProductVectorZ = (vector0[0]*vector1[1] - vector0[1]*vector1[0]);
    var crossProductVector = [crossProductVectorX, crossProductVectorY, crossProductVectorZ];
    return crossProductVector;
}

// multiply a vector by a quaternion
FormIt.PluginUtils.Math.multiplyVectorByQuaternion = function(vectorX, vectorY, vectorZ, quatX, quatY, quatZ, quatW)
{
    var ssvv = (quatW * quatW) - ((quatX * quatX) + (quatY * quatY) + (quatZ * quatZ));
    var vr = ((quatX * vectorX) + (quatY * vectorY) + (quatZ * vectorZ)) * 2.;
    var s = quatW * 2;
    var tmpX = (ssvv * vectorX) + (vr * quatX) + (s * ((quatY * vectorZ) - (quatZ * vectorY)));
    var tmpY = (ssvv * vectorY) + (vr * quatY) + (s * ((quatZ * vectorX) - (quatX * vectorZ)));
    var tmpZ = (ssvv * vectorZ) + (vr * quatZ) + (s * ((quatX * vectorY) - (quatY * vectorX)));

    vector = new Array(tmpX, tmpY, tmpZ);
    return vector;
}

// scale a vector
FormIt.PluginUtils.Math.scaleVector = function(vector, scalar)
{
    scaledVector = new Array(vector[0] * scalar, vector[1] * scalar, vector[2] * scalar);
    return scaledVector;
}

// normalize a vector
FormIt.PluginUtils.Math.normalizeVector = function(vector)
{
    var magnitude = vectorMagnitude(vector);
    var normalizedVector = new Array(vector[0]/magnitude, vector[1]/magnitude, vector[2]/magnitude);
    return normalizedVector;
}

// get the dot product of two vectors
FormIt.PluginUtils.Math.getDotProductVector = function(vector0, vector1)
{
    var vector0Magnitude = vectorMagnitude(vector0);
    var vector1Magnitude = vectorMagnitude(vector1);
    var dotProduct = (vector0[0]/vector0Magnitude * vector1[0]/vector1Magnitude) + (vector0[1]/vector0Magnitude * vector1[1]/vector1Magnitude) + (vector0[2]/vector0Magnitude * vector1[2]/vector1Magnitude);
    return dotProduct;
}

// get the angle in radians between two 3D vectors
FormIt.PluginUtils.Math.getAngleBetweenVectors = function(vector0, vector1)
{
    var normalizedVector0 = normalizeVector(vector0);
    var normalizedVector1 = normalizeVector(vector1);
    var dotProductVector = dotProductVector(normalizedVector0, normalizedVector1);
    angle = Math.acos(dotProductVector)
    return angle;
}

// get the angle in radians between two 2D vectors
FormIt.PluginUtils.Math.getAngleBetween2DVectors = function(vector0, vector1)
{
    angle = Math.acos(dotProductVector(vector0, vector1));
    return angle;
}

//
// array utils
//
FormIt.PluginUtils.Array = FormIt.PluginUtils.Array || {};

// true only if all booleans evaluated are true
FormIt.PluginUtils.Array.booleanReduce = function(array)
{
    function isTrue(bool) 
    {
        if (bool === true) 
        {
            return true;
        }
        else 
        {
            return false;
        }
    }
    
    if (array.every(isTrue))
    {
        return true;
    }
    else 
    {
        return false;
    }
}

// true only if ANY of the booleans evaluated in the array are true
FormIt.PluginUtils.Array.getIsAnyTrue = function(array)
{
    for(var i = 0; i < array.length; i++)
    {
        var bool = array[i];
        if (bool === true) 
        {
            return true;
        }
    }
}

// search through an array, and return an array of only unique values (values that only appear once)
FormIt.PluginUtils.Array.getUniqueValues = function(array)
{
    var uniqueArray = [];
    var count = 0;
    
    for (var i = 0; i < array.length; i++)
    {
        count = 0;
        for (var j = 0; j < array.length; j++)
        {
            if (array[j] === array[i])
                count++;
        }
        if (count === 1)
            uniqueArray.push(array[i]);
    }
    //console.log("Array of unique values: " + uniqueArray);
    return uniqueArray;
}

// search through an array and return an array of every distinct value (eliminating all duplicates)
FormIt.PluginUtils.Array.eliminateDuplicates = function(array)
{
    function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }
    var onlyUniqueArray = array.filter(onlyUnique);

    return onlyUniqueArray;
}

// flatten a multi-dimensional array into a 1D array
FormIt.PluginUtils.Array.flatten = function(array)
{
    return array.reduce(function (flat, toFlatten) 
    {
        return flat.concat(Array.isArray(toFlatten) ? FormIt.PluginUtils.Array.flatten(toFlatten) : toFlatten);
    }, []);
}

// test each item in the array, compare it to its siblings for equality, and return a new array containing the results
FormIt.PluginUtils.Array.testSiblingEquality = function(array) 
{
    var bArray = [];
    for (var k = 0; k < array.length - 1; k++)
    {
        if (array[k] === array[k + 1])
        {
            bArray.push(true);
        }
        if (array[k] != array[k + 1])
        {
            bArray.push(false);
        }
    }
    //console.log(message + bArray);
    return bArray;
}

//
// application-side utils, requiring WSM and/or FormIt
//
FormIt.PluginUtils.Application = FormIt.PluginUtils.Application || {};

FormIt.PluginUtils.Application.getScreenPointInWorldSpace = function(x, y, planeDistance)
{
    // get a pickray at the provided screen point (normalized 0-1)
    var pickray = WSM.Utils.PickRayFromNormalizedScreenPoint(x, y);
    //console.log(JSON.stringify(pickray));

    pickrayPoint = pickray.pickrayLine.point;
    pickrayVector = pickray.pickrayLine.vector;

    newPickrayPointX = pickrayPoint.x + pickrayVector.x * planeDistance;
    newPickrayPointY = pickrayPoint.y + pickrayVector.y * planeDistance;
    newPickrayPointZ = pickrayPoint.z + pickrayVector.z * planeDistance;
    //console.log(newPickrayPointX + ',' + newPickrayPointY + ',' + newPickrayPointZ);

    var pickrayPoint3d = WSM.Geom.Point3d(newPickrayPointX, newPickrayPointY, newPickrayPointZ);

    return pickrayPoint3d;
}

FormIt.PluginUtils.Application.getViewportAspectRatio = function()
{
    var viewportSize = FormIt.Cameras.GetViewportSize();

    return viewportSize.width / viewportSize.height;
}

// get Group instances in this history with a particular string attribute key
FormIt.PluginUtils.Application.getGroupInstancesByStringAttributeKey = function(nHistoryID, stringAttributeKey)
{
    // get all the instances in this history
    var potentialObjectsArray = WSM.APIGetAllObjectsByTypeReadOnly(nHistoryID, WSM.nObjectType.nInstanceType);

    var aFinalObjects = [];

    if (potentialObjectsArray)
    {
        // for each of the objects in this history, look for ones with a particular string attribute key
        for (var i = 0; i < potentialObjectsArray.length; i++)
        {
            var instanceID = potentialObjectsArray[i];
            //console.log("Object ID: " + objectID);

            var objectHasStringAttributeResult = WSM.Utils.GetStringAttributeForObject(nHistoryID, instanceID, stringAttributeKey);

            if (objectHasStringAttributeResult.success == true)
            {
                aFinalObjects.push(instanceID);
            }
        }
    }

    return aFinalObjects;
}

// get Group instances in this history with a particular string attribute key and value pair
FormIt.PluginUtils.Application.getGroupInstancesByStringAttributeKeyAndValue = function(nHistoryID, stringAttributeKey, stringAttributeValue)
{
    // get all the instances in this history with the string attribute key
    var potentialObjectsArray = FormIt.PluginUtils.Application.getGroupInstancesByStringAttributeKey(nHistoryID, stringAttributeKey);

    var aFinalObjects = [];

    // for each of the objects found by key, look for ones with a matching string attribute value
    for (var i = 0; i < potentialObjectsArray.length; i++)
    {
        var instanceID = potentialObjectsArray[i];
        //console.log("Object ID: " + objectID);

        var objectHasStringAttributeResult = WSM.Utils.GetStringAttributeForObject(nHistoryID, instanceID, stringAttributeKey);

        if (objectHasStringAttributeResult.value == stringAttributeValue)
        {
            aFinalObjects.push(instanceID);
        }
    }

    return aFinalObjects;
}

// delete Group instances in the given history with this string attribute key,
// then replace them with a new one, returning the group ID
FormIt.PluginUtils.Application.createOrReplaceGroupInstanceByStringAttributeKey = function(nHistoryID, stringAttributeKey, stringAttributeValue)
{
    // get and delete any existing camera container objects
    var aInstanceIDs = FormIt.PluginUtils.Application.getGroupInstancesByStringAttributeKey(nHistoryID, stringAttributeKey);

    for (var i = 0; i < aInstanceIDs.length; i++)
    {
        WSM.APIDeleteObject(nHistoryID, objectID);
    }

    // now that any existing instances have been deleted, make a new one
    var newGroupID = WSM.APICreateGroup(nHistoryID, [])
    // get the instance ID of the Group
    var newGroupInstanceID = JSON.parse(WSM.APIGetObjectsByTypeReadOnly(nHistoryID, newGroupID, WSM.nObjectType.nInstanceType));

    // add the attribute to the instance
    WSM.Utils.SetOrCreateStringAttributeForObject(nHistoryID,
        newGroupInstanceID, ManageCameras.cameraStringAttributeKey, stringAttributeValue);

    return newGroupID;
}

// create a layer by name, if it doesn't exist already, and return its ID
FormIt.PluginUtils.Application.getOrCreateLayerByName = function(nHistoryID, layerName)
{
    // if the named layer doesn't exist, create it
    if (!FormIt.Layers.LayerExists(layerName))
    {
        FormIt.Layers.AddLayer(nHistoryID, layerName, true);
        //console.log("Created a new Layer: " + "'" + layerName + "'");
    }
    else 
    {
        //console.log("Layer " + "'" + layerName + "'" + " already exists");
    }

    // need to figure out what ID is
    // start by getting all Layers
    var allLayers = FormIt.Layers.GetLayerList();

    var layerID = undefined;

    // look for the Cameras layer by name, and get the ID
    for (var i = 0; i < allLayers.length; i++)
    {
        if (allLayers[i].Name == layerName)
        {
            layerID = allLayers[i].Id;
            //console.log("Matching Layer ID: " + cameraContainerGroupLayerID);
            break;
        }
    }
    
    return layerID;
}
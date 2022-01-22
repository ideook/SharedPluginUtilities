// initialize namespaces
window.FormIt = window.FormIt || {};
FormIt.PluginUI = FormIt.PluginUI || {};

/// UI utilities ///

// converts a value to a properly-formatted FormIt dimension string
// according to the current units
FormIt.PluginUI.convertValueToDimensionString = function(value, callbackFunction)
{
    window.FormItInterface.CallMethod("FormIt.StringConversion.StringToLinearValue", value, function(result)
    {
        // parse the result
        result = JSON.parse(result);

        // if the API was able to convert the value to a dimension, return it
        if (result.first === true)
        {
            window.FormItInterface.CallMethod("FormIt.StringConversion.LinearValueToString", Number(result.second), callbackFunction);
        }
        // otherwise, the value was not a valid number or dimension
        // so return a single unit of value
        else
        {
            window.FormItInterface.CallMethod("FormIt.StringConversion.LinearValueToString", 1, callbackFunction);
        }
    });
}

/// UI classes and modules ///

// typical header - can be used at the top of a whole plugin, or at the top of a subsection
FormIt.PluginUI.HeaderModule = class HeaderModule {
    constructor(headerTitle, headerSubtitle, moduleClassName) {

        // initialize the arguments
        this.headerTitle = headerTitle;
        this.headerSubtitle = headerSubtitle;
        this.moduleClassName = moduleClassName;
        
        // build
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {
        
        // create a container for the header
        let headerContainer = document.createElement('div');
        headerContainer.id = 'pluginHeaderContainer';
        headerContainer.className = this.moduleClassName;

        // create the header elements
        let titleDiv = document.createElement('h1');
        titleDiv.innerHTML = this.headerTitle;
        headerContainer.appendChild(titleDiv);

        let subtitleDiv = document.createElement('p');
        subtitleDiv.innerHTML =  this.headerSubtitle;
        headerContainer.appendChild(subtitleDiv);

        return headerContainer;
    }
}

// typical subheader - can be used to define a sub-section of a multi-plugin
FormIt.PluginUI.SubheaderModule = class SubheaderModule {
    constructor(subheaderTitle, moduleClassName) {

        // initialize the arguments
        this.subheaderTitle = subheaderTitle;
        this.moduleClassName = moduleClassName;
        
        // build
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {
        
        // create a container for the header
        let subheaderContainer = document.createElement('div');
        subheaderContainer.id = 'pluginSubheaderContainer';
        subheaderContainer.className = this.moduleClassName;

        let subtitleDiv = document.createElement('p');
        subtitleDiv.innerHTML =  this.subheaderTitle;
        subheaderContainer.appendChild(subtitleDiv);

        return subheaderContainer;
    }
}

// list container - scrollable and with automatic zero-state
FormIt.PluginUI.ListContainer = class ListContainer {
    constructor(zeroStateMessageText) {

        // initialize the arguments
        this.zeroStateMessageText = zeroStateMessageText;

        // build and attach events
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {
        
        // create the list container element
        this.listContainerDiv = document.createElement('div');
        this.listContainerDiv.className = 'scrollableListContainer';

        // the zero-state message will always be the first child
        this.zeroStateMessageLabel = document.createElement('p');
        this.zeroStateMessageLabel.className = 'scrollableListContainerZeroStateLabel';
        this.zeroStateMessageLabel.innerHTML =  this.zeroStateMessageText;
        this.listContainerDiv.appendChild(this.zeroStateMessageLabel);
        
        return this.listContainerDiv;
    }

    // toggle the zero-state message depending on whether the container has children
    toggleZeroStateMessage()
    {
        // if the child count is greater than 1 (the zero-state message itself is child 0)
        // hide the message
        if (this.listContainerDiv.childElementCount > 1)
        {
            this.zeroStateMessageLabel.className = "hide";
        }
        // otherwise, show it
        else 
        {
            this.zeroStateMessageLabel.className = "show";;
        }
    }

    // override the list height
    setListHeight(nHeight)
    {
        this.listContainerDiv.style.height = nHeight;
    }
}

// expandable list item
FormIt.PluginUI.ExpandableListItem = class ExpandableListItem {
    constructor(buttonText) {

        // initialize the arguments
        this.buttonText = buttonText;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {

        // overall container
        this.overallContainer = document.createElement('div');
        this.overallContainer.className = 'expandableItemContainer';
        
        // button
        this.button = document.createElement("input");
        this.button.setAttribute("type", "button");
        this.button.value = this.buttonText;
        this.button.className = 'expandableItemButtonCollapsed';
        this.button.id = 'expandableItemButton';
        this.overallContainer.appendChild(this.button);

        // expandable content
        this.expandableContentContainer = document.createElement('div');
        this.expandableContentContainer.className = 'hide';
        this.overallContainer.appendChild(this.expandableContentContainer);

        return this.overallContainer;
    }

    attachEvents() {
        this.button.addEventListener('click', () => {
            
            if (this.expandableContentContainer.className == 'hide')
            {
                this.expandableContentContainer.className = 'expandableContentContainer';
                this.button.className = 'expandableItemButtonExpanded';
            }
            else 
            {
                this.expandableContentContainer.className = 'hide';
                this.button.className = 'expandableItemButtonCollapsed';
            }

        });
    }

    // override the list height
    setContentContainerHeight(nHeight)
    {
        this.expandableContentContainer.style.height = nHeight;
    }
}

// typical button
FormIt.PluginUI.Button = class Button {
    constructor(buttonText, onClickFunction) {

        // initialize the arguments
        this.buttonText = buttonText;
        this.onClickFunction = onClickFunction;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        this.button = document.createElement("input");
        this.button.setAttribute("type", "button");
        this.button.value = this.buttonText;
        
        return this.button;
    }

    attachEvents() {
        this.button.addEventListener('click', this.onClickFunction);
    }

}

// button with tooltip
FormIt.PluginUI.ButtonWithTooltip = class ButtonWithTooltip {
    constructor(buttonText, buttonTooltip, onClickFunction) {

        // initialize the arguments
        this.buttonText = buttonText;
        this.buttonTooltip = buttonTooltip;
        this.onClickFunction = onClickFunction;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        this.button = document.createElement("input");
        this.button.setAttribute("type", "button");
        this.button.setAttribute("title", this.buttonTooltip)
        this.button.value = this.buttonText;
        
        return this.button;
    }

    attachEvents() {
        this.button.addEventListener('click', this.onClickFunction);
    }

}

// button with description
FormIt.PluginUI.ButtonWithInfoToggleModule = class ButtonWithInfoToggleModule {
    constructor(buttonText, buttonDescription, onClickFunction) {

        // initialize the arguments
        this.buttonText = buttonText;
        this.buttonDescription = buttonDescription;
        this.onClickFunction = onClickFunction;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        // create a container for the button and description
        this.moduleContainer = document.createElement("div");
        this.moduleContainer.id = "buttonWithInfoToggleModule"

        this.buttonRow = document.createElement("div");
        this.buttonRow.id = "buttonWithInfoToggleRow";

        this.moduleContainer.appendChild(this.buttonRow);

        // create the button
        this.button = document.createElement("input");
        this.button.setAttribute("type", "button");
        this.button.value = this.buttonText;
        this.button.id = "buttonWithInfoToggle";
        
        this.buttonRow.appendChild(this.button);

        // create the info button
        this.infoButton = document.createElement("img");
        this.infoButton.src = "https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/img/info_blue.png";
        this.infoButton.id = "infoToggle";

        this.buttonRow.appendChild(this.infoButton);

        // create the description div
        this.descriptionDiv = document.createElement("div");
        this.descriptionDiv.innerHTML = this.buttonDescription;
        this.descriptionDiv.id = "infoToggleDescription";
        this.descriptionDiv.className = "hide";

        this.moduleContainer.appendChild(this.descriptionDiv);

        return this.moduleContainer;
    }

    attachEvents() {
        this.button.addEventListener('click', this.onClickFunction);

        this.infoButton.addEventListener('click', () => {

                if (this.descriptionDiv.className == "hide")
                {
                    this.descriptionDiv.className = "show";
                    this.infoButton.className = 'infoToggleActive';
                }
                else
                {
                    this.descriptionDiv.className = "hide";
                    this.infoButton.className = 'infoToggleInactive';
                }

        });
    }

}

// "deselect" button - used in Properties Plus
FormIt.PluginUI.DeselectButtonModule = class DeselectButtonModule {
    constructor(onClickFunction, deselectObjectType, buttonLabelText, moduleID, buttonLabelID) {

        // initialize the arguments
        this.onClickFunction = onClickFunction;
        this.deselectObjectType = deselectObjectType;
        this.buttonLabelText = buttonLabelText;
        this.moduleID = moduleID;
        this.buttonLabelID = buttonLabelID;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        // create a container for the button and label
        this.moduleContainer = document.createElement("div");
        this.moduleContainer.id = this.moduleID;

        // create a row for flex styling
        this.deselectButtonRow = document.createElement("div");
        this.deselectButtonRow.id = "deselectButtonRow";
        this.moduleContainer.appendChild(this.deselectButtonRow);

        // create the deselect button
        this.deselectButton = document.createElement("img");
        this.deselectButton.src = "https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/img/remove_blue.png";
        this.deselectButton.id = "deselectButton";
        this.deselectButton.title = "Click to remove this object type from the current selection."
        this.deselectButtonRow.appendChild(this.deselectButton);

        // create the button label
        this.deselectButtonLabel = document.createElement("div");
        this.deselectButtonLabel.innerHTML = this.buttonLabelText;
        this.deselectButtonLabel.id = this.buttonLabelID;
        this.deselectButtonRow.appendChild(this.deselectButtonLabel);

        return this.moduleContainer;
    }

    attachEvents() {

        this.deselectButton.addEventListener("click", () => {

            this.onClickFunction(this.deselectObjectType);

        });

    }

}

// all text or number inputs
FormIt.PluginUI.AlphaNumericInput = class AlphaNumericInput {
    constructor(submitTextFunction) {
        this.existingInputValue = undefined;
        this.submitTextFunction = submitTextFunction;
    }

    // these events need to be attached to every input
    attachEvents() {
        this.input.addEventListener("focus", (event) => {
            // keep track of the existing input value - used to prevent submission if nothing changed
            this.existingInputValue = event.currentTarget.value;
        });

        this.input.addEventListener("blur", (event) => {

            if (this.submitTextFunction)
            {
                // ensure that only if the value is different than it was when we started, do we submit the function
                if (event.currentTarget.value !== this.existingInputValue)
                {
                    const resultCallback = (returnVal) => {

                        returnVal = JSON.parse(returnVal);

                        if (returnVal){
                            this.input.value = returnVal;
                        }
                    }

                    this.submitTextFunction(event.currentTarget.value, resultCallback);
                }
            }
        });

        this.input.addEventListener("keydown", (event) => {
            if (event.keyCode === 13)
            {
                event.preventDefault();
            }
        });

        this.input.addEventListener("keyup", (event) => {
            if (event.keyCode === 13)
            {
                const resultCallback = (returnVal) => {

                    returnVal = JSON.parse(returnVal);

                    if (returnVal){
                        this.input.value = returnVal;
                    }
                }
                this.submitTextFunction(event.currentTarget.value, resultCallback);
                event.preventDefault();
            }
        });
    }
}

// typical text/dimension input and a label - no button
FormIt.PluginUI.TextInputModule = class TextInputModule extends FormIt.PluginUI.AlphaNumericInput {
    constructor(moduleLabelText, moduleID, moduleClassName, inputID, submitTextFunction) {
        
        // call the super function
        super();

        // initialize the arguments
        this.moduleLabelText = moduleLabelText;
        this.moduleID = moduleID;
        this.moduleClassName = moduleClassName;
        this.inputID = inputID;
        this.submitTextFunction = submitTextFunction;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        // create the container
        let container = document.createElement('form');
        container.id = this.moduleID;
        container.className = this.moduleClassName;

        // create the label
        let textInputLabel = document.createElement('div');
        textInputLabel.className = 'inputLabel';
        textInputLabel.innerHTML = this.moduleLabelText;
        container.appendChild(textInputLabel);

        // create the input
        this.input = document.createElement('input');
        this.input.id = this.inputID;
        this.input.setAttribute("type", "text");
        container.appendChild(this.input);

        return container;
    }

    // get the input for get/set value operations
    getInput() {
        return this.input;
    }
}

// typical numeric input and a label
FormIt.PluginUI.NumberInputModule = class NumberInputModule extends FormIt.PluginUI.AlphaNumericInput {
    constructor(moduleLabelText, moduleID, moduleClassName, inputID, submitTextFunction) {
        
        // call the super function
        super();

        // initialize the arguments
        this.moduleLabelText = moduleLabelText;
        this.moduleID = moduleID;
        this.moduleClassName = moduleClassName;
        this.inputID = inputID;
        this.submitTextFunction = submitTextFunction;

        // build and attach events
        this.element = this.build();
        this.attachEvents();
    }

    // construct and append the UI elements
    build() {
        
        // create the container
        let container = document.createElement('form');
        container.id = this.moduleID;
        container.className = this.moduleClassName;

        // create the label
        let textInputLabel = document.createElement('div');
        textInputLabel.className = 'inputLabel';
        textInputLabel.innerHTML = this.moduleLabelText;
        container.appendChild(textInputLabel);

        // create the input
        this.input = document.createElement('input');
        this.input.id = this.inputID;
        this.input.setAttribute("type", "number");
        container.appendChild(this.input);

        return container;
    }
}

// select input / drop-down
FormIt.PluginUI.SelectInputModule = class SelectInputModule {
    constructor(labelText, defaultOption) {
       
        // initialize the arguments
        this.labelText = labelText;
        this.defaultOption = defaultOption;

        // build
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {

        // build the container
        let container = document.createElement('div');

        // create the label
        let selectInputLabel = document.createElement('div');
        selectInputLabel.className = 'inputLabel';
        selectInputLabel.innerHTML = this.labelText;
        selectInputLabel.setAttribute('for', 'selectList');
        container.appendChild(selectInputLabel);

        // create the text input
        this.input = document.createElement('select');
        this.input.setAttribute('name', 'selectList');
        container.appendChild(this.input);

        return container;
    }

    getInput() {
        return this.input;
    }

    clearSelectList() {

        this.input.length = 0;

    }

    populateSelectList(array) {

        this.clearSelectList();

        // first, populate the list with the default option
        let defaultOption = document.createElement('option');
        defaultOption.textContent = this.defaultOption;
        this.input.appendChild(defaultOption);

        // then append the options from the array
        for(let i = 0; i < array.length; i++)
        {
            let option = document.createElement('option');
            option.textContent = array[i];
            this.input.appendChild(option);
        }
    }

}

// typical checkbox input
FormIt.PluginUI.CheckboxModule = class CheckboxModule {
    constructor(labelText, moduleID, moduleClassName, inputID) {
       
        // initialize the arguments
        this.labelText = labelText;
        this.moduleID = moduleID;
        this.moduleClassName = moduleClassName;
        this.inputID = inputID;

        // build
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {

        // build the container
        let container = document.createElement('form');
        container.id = this.moduleID;
        container.className = this.moduleClassName;

        // create the checkbox
        this.input = document.createElement('input');
        this.input.id = this.inputID;
        this.input.setAttribute("type", "checkbox");
        container.appendChild(this.input);

        // create the label
        let checkboxLabel = document.createElement('div');
        checkboxLabel.className = 'inputLabel';
        checkboxLabel.innerHTML = this.labelText;
        container.appendChild(checkboxLabel);

        return container;
    }

    getInput() {
        return this.input;
    }
}

// typical footer
FormIt.PluginUI.FooterModule = class FooterModule {
    constructor() {
       
        // build
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {
        let footerContainer = document.createElement('div');
        footerContainer.id = 'pluginFooterContainer';
    
        let footerDiv = document.createElement('div');
        footerDiv.id = 'pluginFooterDiv';
        footerContainer.appendChild(footerDiv);

        let footerIcon = document.createElement('img');
        footerIcon.src = 'https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/img/plugin_manager_grey.png';
        footerIcon.id = 'pluginFooterIcon';
        footerDiv.appendChild(footerIcon);
    
        let footerDescriptionText = document.createTextNode("Powered by FormIt JavaScript plugins");
        footerDiv.appendChild(footerDescriptionText);
    
        let footerDivUL = document.createElement('ul');
        footerDiv.appendChild(footerDivUL);
    
        let footerLearnAboutPluginsLI = document.createElement('li');
        let footerLearnAboutPluginsLink = document.createElement('a');
        let footerLearnAboutPluginsText = document.createTextNode("Learn about plugins");
        footerLearnAboutPluginsLink.appendChild(footerLearnAboutPluginsText);
        footerLearnAboutPluginsLink.setAttribute("href", "javascript:void(0);");
        footerDivUL.appendChild(footerLearnAboutPluginsLI);
        footerLearnAboutPluginsLI.appendChild(footerLearnAboutPluginsLink);
    
        footerLearnAboutPluginsLink.onclick = function() {
            FormItInterface.CallMethod("FormIt.OpenURL", 'https://formit3d.github.io/FormItExamplePlugins/index.html');
        }
    
        let footerLearnToBuildLI = document.createElement('li');
        let footerLearnToBuildLink = document.createElement('a');
        let footerLearnToBuildText = document.createTextNode("Build your own");
        footerLearnToBuildLink.appendChild(footerLearnToBuildText);
        footerLearnToBuildLink.setAttribute("href", "javascript:void(0);");
        footerDivUL.appendChild(footerLearnToBuildLI);
        footerLearnToBuildLI.appendChild(footerLearnToBuildLink);
    
        footerLearnToBuildLink.onclick = function() {
            FormItInterface.CallMethod("FormIt.OpenURL", 'https://formit3d.github.io/FormItExamplePlugins/docs/HowToBuild.html');
        }

        return footerContainer;
    }
}

// message module for unsupported version
// if a specific version is specified, the message will tell the user they need at least that version
FormIt.PluginUI.UnsupportedVersionModule = class UnsupportedVersionModule {
    constructor(versionString) {

        // initialize the arguments
        this.versionString = versionString;
        
        // build
        this.element = this.build();
    }

    // construct and append the UI elements
    build() {
        
        // create a container
        let unsupportedVersionContainer = document.createElement('div');
        unsupportedVersionContainer.id = 'unsupportedVersionContainer';

        // create the icon
        let unsupportedVersionIcon = document.createElement('img');
        // https://formit3d.github.io
        unsupportedVersionIcon.src = 'https://formit3d.github.io/FormItExamplePlugins/SharedPluginFiles/img/info_grey.png';
        unsupportedVersionIcon.id = 'unsupportedVersionIcon';
        unsupportedVersionContainer.appendChild(unsupportedVersionIcon);

        // create the message
        let unsupportedVersionMessage = document.createElement('p');
        unsupportedVersionContainer.appendChild(unsupportedVersionMessage);

        // if the version is specified, use it
        if (this.versionString)
        {
            unsupportedVersionMessage.innerHTML =  'FormIt ' + this.versionString + ' or newer is required to run this plugin.';
        }
        // otherwise, use a generic message
        else
        {
            unsupportedVersionMessage.innerHTML =  'A newer version of FormIt is required to run this plugin.';
        }

        let downloadLink = document.createElement('a');
        downloadLink.innerHTML =  'Download the latest version of FormIt.';
        unsupportedVersionContainer.appendChild(downloadLink);

        downloadLink.setAttribute("href", "javascript:void(0);");
    
        downloadLink.onclick = function() {
            FormItInterface.CallMethod("FormIt.OpenURL", 'https://formit.autodesk.com/page/download');
        }

        return unsupportedVersionContainer;
    }
}


// create a container to host multiple child elements, organizing them horizontally
FormIt.PluginUI.MultiModuleContainer = class MultiModuleContainer {
    constructor() {
        // build
        this.element = this.build();
    }

    build() {
        let multiModuleContainer = document.createElement('div');
        multiModuleContainer.id = 'multiModuleContainer';
        multiModuleContainer.className = 'multiModuleContainer';

        return multiModuleContainer;
    }
}
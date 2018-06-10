module.exports={
    checkForAristosUpdates: function(){
        // check Aristos patch information to see if current version is the same
        // files to check: all of includes, content/plugins, content/upgrade

        // make GET request to check for current build and compare
        // write to json file if builds are different
        // fs.writeJson('./package.json', {name: 'fs-extra'})
        // also place files to change in temp folder
        // display on dashboard if update is needed
    },

    checkForThemeUpdates: function(){
        // check theme patch information to see if current version is the same
        // files to check: content/theme

        // make GET request to check for current build and compare
        // write to json file if builds are different
        // fs.writeJson('./package.json', {name: 'fs-extra'})
        // display on dashboard if update is needed

    },

    executeAristosUpdate: function(){
        // change nessesary files according to patch
        // possible files to update: all of includes, content/plugins, content/upgrade

        // check json file for information 
        // fs.readFile(path[, options], callback)??
       

        // change tempfolder info to live folder info
        // fs.copyFile(src, dest[, flags], callback)???

    },

    executeThemeUpdate: function(){
        // change nessesary files according to patch
        // possible files to update: content/theme


        // check json file for information 
        // fs.readFile(path[, options], callback)??
        
        // change tempfolder info to live folder info
        // fs.copyFile(src, dest[, flags], callback)???


    }

}
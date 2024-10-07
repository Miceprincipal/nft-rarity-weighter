const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the cors package

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const baseDirectory = path.join(__dirname, './'); // Root folder for your structure

// This structure will store your folders
let folderStructure = {};

// Function to recursively get folder structure starting from the current directory
function getFolderStructure(dirPath) {
    let structure = [];
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            const children = getFolderStructure(fullPath); // Recursively get subdirectories
            structure.push({
                type: 'folder',
                name: item,
                children: children
            });
            // Store folder in a global structure for reference
            folderStructure[item] = fullPath; // Map folder name to its path
        }
    });

    return structure;
}

// Serve the folder structure as before
app.get('/folders', (req, res) => {
    folderStructure = {}; // Reset structure on each fetch
    const folderStructureResponse = getFolderStructure(process.cwd()); // Start from the current working directory
    res.json(folderStructureResponse);
});

// Serve the folder structure as before
app.get('/folders', (req, res) => {
    const folderStructure = getFolderStructure(process.cwd()); // Start from the current working directory
    res.json(folderStructure);
});

app.post('/update-folder', (req, res) => {
    const { oldName, newName } = req.body;

    // Find the old folder path from the folder structure
    const oldFolderPath = folderStructure[oldName]; // Use the global structure to get path
    const newFolderPath = path.join(path.dirname(oldFolderPath), newName); // Update new path based on the same directory

    // Log paths for debugging
    console.log('Old Folder Path:', oldFolderPath);
    console.log('New Folder Path:', newFolderPath);

    // Check if the old folder exists
    if (!oldFolderPath || !fs.existsSync(oldFolderPath)) {
        console.error('Old folder does not exist:', oldFolderPath);
        return res.status(404).json({ error: 'Old folder not found' });
    }

    // Rename the folder
    fs.rename(oldFolderPath, newFolderPath, (err) => {
        if (err) {
            console.error('Error renaming folder:', err);
            return res.status(500).json({ error: 'Error renaming folder' });
        }
        console.log(`Folder renamed from ${oldFolderPath} to ${newFolderPath}`);
        res.json({ success: true });
    });
});



// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

const baseDirectory = path.join(__dirname, './'); // Root folder for your structure

// Function to recursively get folder structure starting from the current directory
function getFolderStructure(dirPath) {
    let structure = [];
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            // Recursively get subdirectories
            const children = getFolderStructure(fullPath);
            structure.push({
                type: 'folder',
                name: item,
                children: children
            });
        } else if (stats.isFile() && (item.endsWith('.png') || item.endsWith('.jpg'))) {
            // Only include files with .png and .jpg extensions
            structure.push({
                type: 'file',
                name: item // You can also store full path or other data if needed
            });
        }
    });

    return structure;
}

// Serve the folder structure
app.get('/folders', (req, res) => {
    const folderStructureResponse = getFolderStructure(baseDirectory); // Start from the base directory
    res.json(folderStructureResponse);
});

// Update folder route
app.post('/update-folder', (req, res) => {
    const { oldName, newName } = req.body;

    const oldFilePath = path.join(baseDirectory, oldName); // Construct full path using base directory
    const newFilePath = path.join(path.dirname(oldFilePath), newName); // Create new file path based on the same directory

    // Check if the old file exists
    if (!fs.existsSync(oldFilePath)) {
        console.error('Old file does not exist:', oldFilePath);
        return res.status(404).json({ error: 'Old file not found' });
    }

    // Rename the file
    fs.rename(oldFilePath, newFilePath, (err) => {
        if (err) {
            console.error('Error renaming file:', err);
            return res.status(500).json({ error: 'Error renaming file' });
        }
        console.log(`File renamed from ${oldFilePath} to ${newFilePath}`);
        res.json({ success: true });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


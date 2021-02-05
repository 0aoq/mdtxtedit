/*
Created 2/4/2021
Uses local file storage API to load files
*/

// Variables

const FileUploadBtn = find("#FileOpen")
const FileSaveBtn = find("#FileSave")
const FileSaveAsBtn = find("#FileSaveAs")
const FileBlank = find("#FileBlank")

const PostTextArea = find("#typing-box")

const OpenedFile = find("#OpenedFile")

let fileHandle

var HasSaveFile = false

btns(false)

function btns(visible) {
    if (visible === false) {
        display(FileSaveBtn, false)
        display(FileSaveAsBtn, false)
        display(find("#editor-open"), false)
    } else if (visible === true) {
        display(FileSaveBtn, true, "inline-block")
        display(FileSaveAsBtn, true, "inline-block")
        display(find("#editor-open"), true, "inline-block")
        display(find("#viewer-open"), false)

        display(find("#viewer"), true, "block")
        display(find("#editor"), false)
    }
}

FileUploadBtn.addEventListener("click", async() => {
    HasSaveFile = true

    display(PostTextArea, false)

    OpenedFile.style.display = "inline-block"
    OpenedFile.innerHTML = "Opened: Choosing..."
})

FileBlank.addEventListener("click", () => {
    HasSaveFile = false
    FileSaveBtn.classList.add("disabled")

    display(PostTextArea)
    find("#md-box").innerHTML = marked("This file is empty.")

    document.title = "Viewer: Viewing Document"
    fileHandle = null

    btns(true)

    PostTextArea.value = ""
    OpenedFile.innerHTML = "Opened: New File"
    OpenedFile.style.display = "inline-block"
})

PostTextArea.addEventListener('input', async() => {
    if (fileHandle) {
        const file = await fileHandle.getFile()
        OpenedFile.innerHTML = 'Opened: *' + await file.name
    }
})

const fileOptions = {
    types: [{
        description: 'Text Files',
        accept: {
            'text/plain': ['.txt'],
            // More common text files
            'html/plain': ['.html'],
            'css/plain': ['.css'],
            'js/plain': ['.js'],
            'json/plain': ['.json'],
            'c/plain': ['.c'],
            'json/plain': ['.json'],
            'cc/plain': ['.cc'],
            'cs/plain': ['.cs'],
            'gitignore/plain': ['.gitignore'],
            'cache/plain': ['.cache'],
            'markdown/plain': ['.md'],
            // Add other text file types below
            // 'example/plain': ['.example'],
        },
    }, ],
};

// File Btns

FileUploadBtn.addEventListener('click', async() => {
    [fileHandle] = await window.showOpenFilePicker(fileOptions)
    const file = await fileHandle.getFile()
    const contents = await file.text()

    if (contents == "") {
        find("#md-box").innerHTML = marked("This file is empty.")
    } else {
        PostTextArea.value = contents
    }

    document.title = "Viewer: Viewing " + file.name

    find("#md-box").innerHTML = marked(find("#typing-box").value)

    FileSaveBtn.classList.remove("disabled")
    OpenedFile.innerHTML = "Opened: " + await file.name
    btns(true)
    display(PostTextArea)
    OpenedFile.style.display = "inline-block"
})

document.getElementById("editor-open").addEventListener('click', async() => {
    if (HasSaveFile === true) {
        const file = await fileHandle.getFile()
        document.title = "Editor: Editting " + file.name
    } else {
        document.title = "Editor: Editting Document"
    }
})

document.getElementById("viewer-open").addEventListener('click', async() => {
    if (HasSaveFile === true) {
        const file = await fileHandle.getFile()
        document.title = "Viewer: Viewing " + file.name
    } else {
        document.title = "Viewer: Viewing Document"
    }
})

FileSaveBtn.addEventListener('click', async() => {
    if (checkSaveFile()) {
        writeFile(fileHandle, PostTextArea.value)
        const file = await fileHandle.getFile()
        OpenedFile.innerHTML = "Opened: " + await file.name
    }
})

FileSaveAsBtn.addEventListener('click', async() => {
    writeFileAs()
})

// File Functions

async function writeFile(fileHandle, contents) {
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
}

async function writeFileAs() {
    const handle = await window.showSaveFilePicker(fileOptions);
    writeFile(handle, PostTextArea.value)

    if (!checkSaveFile()) {
        FileSaveBtn.classList.remove("disabled")
        HasSaveFile = true
    }

    fileHandle = handle
    OpenedFile.innerHTML = "Opened: New File"

    OpenedFile.innerHTML = "Opened: " + await file.name

    return handle;
}

function checkSaveFile() {
    if (HasSaveFile === false) {
        FileSaveBtn.classList.add("disabled")
        HasSaveFile = false

        return false
    } else {
        FileSaveBtn.classList.remove("disabled")
        HasSaveFile = true

        return true
    }
}

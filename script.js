document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const xmlViewerArea = document.getElementById('xmlViewerArea');
    const fileInput = document.getElementById('fileInput');
    const xmlContent = document.getElementById('xmlContent');
    const uploadButton = document.querySelector('.upload-button');
    const showExampleButton = document.querySelector('.action-button:nth-child(2)');
    const closeViewerButton = document.querySelector('.viewer-button:nth-child(1)');
    const downloadViewerButton = document.querySelector('.viewer-button:nth-child(2)');
    const viewerTitle = document.querySelector('.viewer-title');
    const menuButtons = document.querySelectorAll('.menu-button');
    const fileItems = document.querySelectorAll('.file-item');
    const submenus = document.querySelectorAll('.submenu');
    

    let currentFile = null;
    let currentFileName = '';


    function toggleSubmenu(button) {
        const submenu = button.closest('.menu-section').querySelector('.submenu');
        const icon = button.querySelector('i');
        
        if (submenu.style.display === 'block') {
            submenu.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';
        } else {
            submenu.style.display = 'block';
            icon.style.transform = 'rotate(90deg)';
        }
    }
    

    function activateMenuItem(item) {

        document.querySelectorAll('.menu-item, .file-item').forEach(el => {
            el.classList.remove('active');
        });

        item.classList.add('active');
    }
    

    function displayXMLFile(file) {
        currentFile = file;
        currentFileName = file.name;

        viewerTitle.textContent = currentFileName;
        

        uploadArea.style.display = 'none';
        xmlViewerArea.style.display = 'flex';
        

        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            displayXMLContent(content);
        };
        
        reader.onerror = function(e) {
            xmlContent.innerHTML = `<p class="error-message"><i class="fas fa-exclamation-triangle"></i> Ошибка при чтении файла: ${e.target.error}</p>`;
        };
        
        reader.readAsText(file);
    }
    

    function displayXMLContent(xmlText) {
        try {

            const formattedXML = formatXML(xmlText);
            

            const highlightedXML = highlightXML(formattedXML);
            
            xmlContent.innerHTML = highlightedXML;
        } catch (error) {

            xmlContent.textContent = xmlText;
        }
    }
    

    function formatXML(xml) {
  
        xml = xml.replace(/(>)(<)(\/*)/g, '$1\n$2$3');
        

        let lines = xml.split('\n');
        let indent = '';
        let formatted = [];
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            
            if (!line) continue;

            if (line.match(/^<\/\w/)) {
                indent = indent.substring(2);
            }

            formatted.push(indent + line);

            if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
                indent += '  ';
            }
        }
        
        return formatted.join('\n');
    }
    

    function highlightXML(xml) {

        xml = xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        

        xml = xml.replace(
            /(&lt;\/?)(\w+)([^&]*?)(&gt;)/g,
            '$1<span class="xml-tag">$2</span>$3$4'
        );
        

        xml = xml.replace(
            /(\s+\w+)=/g,
            '<span class="xml-attr">$1</span>='
        );
        

        xml = xml.replace(
            /"([^"]*)"/g,
            '"<span class="xml-value">$1</span>"'
        );
        

        xml = xml.replace(
            /(&lt;!--[\s\S]*?--&gt;)/g,
            '<span class="xml-comment">$1</span>'
        );
        
        return xml;
    }
    

    function showExampleFile() {
        const exampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<project>
    <name>Пример проекта</name>
    <version>1.0</version>
    <description>
        Это пример XML файла для демонстрации работы просмотрщика.
    </description>
    <author>
        <name>Иванов Иван</name>
        <email>ivanov@example.com</email>
        <department>Технический отдел</department>
    </author>
    <components>
        <component id="1">
            <name>Основной модуль</name>
            <type>Процессор</type>
            <specifications>
                <clock>3.5 GHz</clock>
                <cores>8</cores>
                <cache>16 MB</cache>
            </specifications>
        </component>
        <component id="2">
            <name>Графический модуль</name>
            <type>Видеокарта</type>
            <specifications>
                <memory>8 GB</memory>
                <type>GDDR6</type>
                <interface>PCIe 4.0</interface>
            </specifications>
        </component>
    </components>
    <metadata>
        <created>2023-10-15</created>
        <modified>2023-11-20</modified>
        <format>XML 1.0</format>
    </metadata>
</project>`;
        
        currentFileName = 'Пример XML файла.xml';
        viewerTitle.textContent = currentFileName;
        
        uploadArea.style.display = 'none';
        xmlViewerArea.style.display = 'flex';
        displayXMLContent(exampleXML);
    }
    

    

    menuButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSubmenu(this);
        });
    });
    

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            activateMenuItem(this);
        });
    });
    

    fileItems.forEach(item => {
        item.addEventListener('click', function() {
            activateMenuItem(this);
            

            setTimeout(() => {
                showExampleFile();
            }, 300);
        });
    });
    

    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });
    

    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            

            if (file.type === 'text/xml' || file.name.endsWith('.xml')) {
                displayXMLFile(file);
            } else {
                alert('Пожалуйста, выберите XML файл');

            }

            fileInput.value = '';
        }
    });

    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#2980b9';
        uploadArea.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#3498db';
        uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#3498db';
        uploadArea.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            
            if (file.type === 'text/xml' || file.name.endsWith('.xml')) {
                displayXMLFile(file);
            } else {
                alert('Пожалуйста, перетащите XML файл');
            }
        }
    });

    showExampleButton.addEventListener('click', showExampleFile);
    

    closeViewerButton.addEventListener('click', function() {
        xmlViewerArea.style.display = 'none';
        uploadArea.style.display = 'flex';
        currentFile = null;
        currentFileName = '';
    });
    
   
    downloadViewerButton.addEventListener('click', function() {
        if (currentFile) {
         
            const url = URL.createObjectURL(currentFile);
            const a = document.createElement('a');
            a.href = url;
            a.download = currentFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (currentFileName === 'Пример XML файла.xml') {
            
            const exampleContent = xmlContent.textContent;
            const blob = new Blob([exampleContent], { type: 'text/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = currentFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    });
    

    if (menuButtons.length > 0) {
        const firstButton = menuButtons[0];
        const firstSubmenu = firstButton.closest('.menu-section').querySelector('.submenu');
        const firstIcon = firstButton.querySelector('i');
        
        firstSubmenu.style.display = 'block';
        firstIcon.style.transform = 'rotate(90deg)';
    }
});
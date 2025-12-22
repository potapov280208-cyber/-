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
    
    // Добавляем контейнеры для разных типов файлов
    const viewerContainer = document.querySelector('.viewer-container');
    
    // Создаем дополнительные контейнеры для разных типов файлов
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';
    imageContainer.style.display = 'none';
    imageContainer.innerHTML = '<img id="image-viewer" style="max-width: 100%; max-height: 70vh;">';
    
    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';
    textContainer.style.display = 'none';
    
    const pdfContainer = document.createElement('div');
    pdfContainer.className = 'pdf-container';
    pdfContainer.style.display = 'none';
    pdfContainer.innerHTML = '<iframe id="pdf-viewer" style="width: 100%; height: 70vh; border: none;"></iframe>';
    
    const zipContainer = document.createElement('div');
    zipContainer.className = 'zip-container';
    zipContainer.style.display = 'none';
    
    // Вставляем контейнеры в viewer-container
    viewerContainer.appendChild(imageContainer);
    viewerContainer.appendChild(textContainer);
    viewerContainer.appendChild(pdfContainer);
    viewerContainer.appendChild(zipContainer);
    
    let currentFile = null;
    let currentFileName = '';
    
    // Иконки для типов файлов
    const fileIcons = {
        'image': 'fas fa-file-image',
        'pdf': 'fas fa-file-pdf',
        'text': 'fas fa-file-alt',
        'code': 'fas fa-file-code',
        'xml': 'fas fa-file-code',
        'xsd': 'fas fa-file-code',
        'zip': 'fas fa-file-archive',
        'unknown': 'fas fa-file'
    };
    
    // Цвета для типов файлов
    const fileColors = {
        'image': '#e74c3c',
        'pdf': '#e67e22',
        'text': '#3498db',
        'code': '#9b59b6',
        'xml': '#2ecc71',
        'xsd': '#1abc9c',
        'zip': '#f39c12',
        'unknown': '#95a5a6'
    };

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

    // Определение типа файла
    function getFileType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico'].includes(ext)) return 'image';
        if (ext === 'pdf') return 'pdf';
        if (['txt', 'md', 'rtf'].includes(ext)) return 'text';
        if (['html', 'htm', 'css', 'js', 'json', 'py', 'java', 'cpp', 'c', 'php', 'cs', 'rb', 'go'].includes(ext)) return 'code';
        if (ext === 'xml') return 'xml';
        if (ext === 'xsd') return 'xsd';
        if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'].includes(ext)) return 'zip';
        return 'unknown';
    }
    
    // Описание типа файла
    function getFileTypeDescription(type) {
        const descriptions = {
            'image': 'Изображение',
            'pdf': 'PDF документ',
            'text': 'Текстовый файл',
            'code': 'Файл кода',
            'xml': 'XML файл',
            'xsd': 'XSD схема',
            'zip': 'Архив',
            'unknown': 'Другой тип'
        };
        return descriptions[type] || 'Неизвестный тип';
    }
    
    // Форматирование размера файла
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number' || bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // Основная функция отображения файла
    function displayFile(file) {
        currentFile = file;
        currentFileName = file.name;
        const fileType = getFileType(file.name);

        viewerTitle.textContent = currentFileName + ` (${getFileTypeDescription(fileType)})`;
        
        // Скрываем upload area и показываем viewer
        uploadArea.style.display = 'none';
        xmlViewerArea.style.display = 'flex';
        
        // Скрываем все контейнеры
        xmlContent.style.display = 'none';
        imageContainer.style.display = 'none';
        textContainer.style.display = 'none';
        pdfContainer.style.display = 'none';
        zipContainer.style.display = 'none';
        
        // Отображаем файл в зависимости от типа
        switch(fileType) {
            case 'image':
                displayImageFile(file);
                break;
            case 'pdf':
                displayPDFFile(file);
                break;
            case 'text':
            case 'code':
                displayTextFile(file);
                break;
            case 'xml':
            case 'xsd':
                displayXMLFile(file);
                break;
            case 'zip':
                displayZipFile(file);
                break;
            default:
                displayUnknownFile(file);
        }
    }

    // Отображение изображений
    function displayImageFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageViewer = document.getElementById('image-viewer');
            imageViewer.src = e.target.result;
            imageContainer.style.display = 'block';
        };
        reader.onerror = function(e) {
            xmlContent.innerHTML = `<p class="error-message"><i class="fas fa-exclamation-triangle"></i> Ошибка при чтении файла изображения</p>`;
            xmlContent.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // Отображение PDF
    function displayPDFFile(file) {
        const url = URL.createObjectURL(file);
        const pdfViewer = document.getElementById('pdf-viewer');
        pdfViewer.src = url;
        pdfContainer.style.display = 'block';
    }

    // Отображение текстовых файлов
    function displayTextFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            textContainer.innerHTML = `<pre style="background: #f5f5f5; padding: 20px; border-radius: 5px; max-height: 70vh; overflow: auto;">${content}</pre>`;
            textContainer.style.display = 'block';
        };
        reader.readAsText(file);
    }

    // Отображение XML файлов
    function displayXMLFile(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            displayXMLContent(content);
            xmlContent.style.display = 'block';
        };
        
        reader.onerror = function(e) {
            xmlContent.innerHTML = `<p class="error-message"><i class="fas fa-exclamation-triangle"></i> Ошибка при чтении файла: ${e.target.error}</p>`;
            xmlContent.style.display = 'block';
        };
        
        reader.readAsText(file);
    }

    // Отображение ZIP архивов
    function displayZipFile(file) {
        if (typeof JSZip !== 'undefined') {
            const jszip = new JSZip();
            jszip.loadAsync(file)
                .then(function(zip) {
                    let content = `<h3><i class="fas fa-file-archive"></i> Содержимое архива: ${file.name}</h3>`;
                    content += `<div style="background: #f5f5f5; padding: 20px; border-radius: 5px; max-height: 70vh; overflow: auto;">`;
                    
                    let fileCount = 0;
                    let folderCount = 0;
                    
                    for (const [filename, zipEntry] of Object.entries(zip.files)) {
                        if (zipEntry.dir) {
                            content += `<p><i class="fas fa-folder"></i> ${filename}</p>`;
                            folderCount++;
                        } else {
                            const size = formatFileSize(zipEntry._data.uncompressedSize || 0);
                            content += `<p><i class="fas fa-file"></i> ${filename} <span style="color: #666; font-size: 0.9em;">(${size})</span></p>`;
                            fileCount++;
                        }
                    }
                    
                    content += `<hr style="margin: 20px 0;">`;
                    content += `<p><strong>Всего:</strong> ${folderCount} папок, ${fileCount} файлов</p>`;
                    content += `</div>`;
                    
                    zipContainer.innerHTML = content;
                    zipContainer.style.display = 'block';
                })
                .catch(function(error) {
                    zipContainer.innerHTML = `<p class="error-message"><i class="fas fa-exclamation-triangle"></i> Ошибка при чтении архива: ${error.message}</p>`;
                    zipContainer.style.display = 'block';
                });
        } else {
            zipContainer.innerHTML = `<p><i class="fas fa-exclamation-triangle"></i> Для просмотра ZIP архивов требуется библиотека JSZip.</p>`;
            zipContainer.style.display = 'block';
        }
    }

    // Отображение неизвестных файлов
    function displayUnknownFile(file) {
        xmlContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-file" style="font-size: 48px; color: #95a5a6; margin-bottom: 20px;"></i>
                <h3>${file.name}</h3>
                <p>Тип файла: ${getFileTypeDescription(getFileType(file.name))}</p>
                <p>Размер: ${formatFileSize(file.size)}</p>
                <p>Этот формат файла не поддерживает предпросмотр.</p>
            </div>
        `;
        xmlContent.style.display = 'block';
    }

    // Форматирование и подсветка XML (оставляем существующую функцию)
    function displayXMLContent(xmlText) {
        try {
            const formattedXML = formatXML(xmlText);
            const highlightedXML = highlightXML(formattedXML);
            xmlContent.innerHTML = highlightedXML;
        } catch (error) {
            xmlContent.textContent = xmlText;
        }
    }

    // Форматирование XML (оставляем существующую функцию)
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

    // Подсветка XML (оставляем существующую функцию)
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

    // Функция показа примера (обновляем для всех типов)
    function showExampleFile() {
        currentFileName = 'Пример XML файла.xml';
        viewerTitle.textContent = currentFileName + ' (XML файл)';
        
        uploadArea.style.display = 'none';
        xmlViewerArea.style.display = 'flex';
        xmlContent.style.display = 'block';
        
        // Скрываем другие контейнеры
        imageContainer.style.display = 'none';
        textContainer.style.display = 'none';
        pdfContainer.style.display = 'none';
        zipContainer.style.display = 'none';
        
        const exampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<project>
    <name>Пример XML файла</name>
    <version>1.0</version>
    <description>
        Это пример XML файла для демонстрации работы просмотрщика.
    </description>
    <components>
        <component id="1">
            <name>Основной модуль</name>
            <type>XML парсер</type>
        </component>
        <component id="2">
            <name>Визуализация</name>
            <type>Подсветка синтаксиса</type>
        </component>
    </components>
</project>`;
        
        displayXMLContent(exampleXML);
    }

    // Обработчики событий (оставляем существующие)
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

    // Обработчик загрузки файла
    uploadButton.addEventListener('click', function() {
        fileInput.click();
    });

    // Обработчик выбора файла
    fileInput.addEventListener('change', function(e) {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            displayFile(file);
            fileInput.value = '';
        }
    });

    // Drag and Drop обработчики
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
            displayFile(file);
        }
    });

    // Кнопка показа примера
    showExampleButton.addEventListener('click', showExampleFile);

    // Кнопка закрытия просмотрщика
    closeViewerButton.addEventListener('click', function() {
        xmlViewerArea.style.display = 'none';
        uploadArea.style.display = 'flex';
        currentFile = null;
        currentFileName = '';
    });
    
    // Кнопка скачивания файла
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

    // Раскрываем первый подменю по умолчанию
    if (menuButtons.length > 0) {
        const firstButton = menuButtons[0];
        const firstSubmenu = firstButton.closest('.menu-section').querySelector('.submenu');
        const firstIcon = firstButton.querySelector('i');
        
        firstSubmenu.style.display = 'block';
        firstIcon.style.transform = 'rotate(90deg)';
    }
    
    // Добавляем стили для разных типов файлов
    const style = document.createElement('style');
    style.textContent = `
        .image-container, .text-container, .pdf-container, .zip-container {
            width: 100%;
            padding: 20px;
        }
        
        .xml-tag {
            color: #e67e22;
            font-weight: bold;
        }
        
        .xml-attr {
            color: #3498db;
        }
        
        .xml-value {
            color: #27ae60;
        }
        
        .xml-comment {
            color: #95a5a6;
            font-style: italic;
        }
        
        .error-message {
            color: #e74c3c;
            padding: 20px;
            text-align: center;
        }
        
        .viewer-container pre {
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 14px;
            line-height: 1.5;
            white-space: pre-wrap;
            word-wrap: break-word;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            max-height: 70vh;
            overflow: auto;
        }
        
        .zip-container p {
            margin: 5px 0;
            padding: 5px 10px;
            border-left: 3px solid #f39c12;
        }
        
        .zip-container i.fa-folder {
            color: #f39c12;
            margin-right: 8px;
        }
        
        .zip-container i.fa-file {
            color: #95a5a6;
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
});
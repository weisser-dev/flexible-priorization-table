
# Prioritization Table README

This README provides information about the Prioritization Table, a flexible table for prioritizing tasks or projects. The table is designed to help you manage and organize your tasks effectively. You can use this table to prioritize items based on their importance, assign responsibilities, and manage their status.

## Table Features

-   **Flexible Prioritization:** You can easily change the priority of items by moving them up or down the list.
-   **Copy Functionality:** You can copy the entire table for sharing and inserting into various platforms like Confluence and SharePoint.
-   **Strikethrough:** You can mark completed items by striking through them.
-   **On-Hold Status:** You can temporarily put items on hold and later resume them.

## Table Structure

The Prioritization Table consists of the following columns:

1.  **Priority (Prio):** Indicates the priority of the item using icons (exclamation triangle, arrow up, etc.).
2.  **Topic (Thema):** Describes the task or project.
3.  **Technical Responsible (Technisch Verantwortlich):** Specifies the person responsible for technical aspects.
4.  **Functional Responsible (Fachlich Verantwortlich):** Specifies the person responsible for functional aspects.
5.  **Ticket-ID / Epic:** Contains a link to the corresponding ticket or epic.
6.  **Action (Aktion):** Allows you to perform actions like moving rows, striking through, and deleting.

## Getting Started

1.  Copy the HTML code provided in the `<!DOCTYPE html> ... </html>` section and paste it into your HTML editor.
2.  Make sure to include the necessary CSS and JavaScript files:
    -   Bootstrap CSS: `https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css`
    -   Font Awesome CSS: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css`
    -   Custom CSS: `styles.css` (External CSS)
    -   jQuery: `https://code.jquery.com/jquery-3.3.1.slim.min.js`
    -   Popper.js: `https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js`
    -   Bootstrap JS: `https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js`
    -   Custom JavaScript: `script.js` (External JavaScript)
3.  Customize the table by adding or modifying rows as needed.

## Usage

### Changing Priority

-   To change the priority of an item, click the "Up" or "Down" arrow buttons in the "Aktion" column.

### Copying the Table

-   To copy the entire table, click the "Copy" button. The table will be copied to your clipboard, ready to be pasted elsewhere.

### Strikethrough

-   To mark an item as completed, click the "Trash" button in the "Aktion" column to strike through the item.

### On-Hold Status

-   To put an item on hold, click the "On Hold setzen" button in the context menu. The priority icon will change, and the item will be on hold. Click "Fortsetzen" to resume it.

### Adding Rows

-   To add a new row, click the "Neues Thema" button. Customize the new row as needed.

### Context Menu

-   Right-click on a row or header to access the context menu. This menu provides additional options such as adding rows above or below, moving rows, deleting rows, and more.

## Customization

-   You can customize the table's appearance and behavior by modifying the provided CSS and JavaScript files (`styles.css` and `script.js`).

## Compatibility

-   The table is designed to be responsive and should work well on both desktop and mobile devices.

## Note

-   Ensure that you have the necessary permissions to copy, edit, and manage the table content.

Feel free to adapt and use this Prioritization Table to manage your projects or tasks effectively. If you encounter any issues or have suggestions for improvement, please refer to the provided JavaScript and CSS files for customization and make the changes accordingly.

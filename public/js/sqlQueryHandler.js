export const sqlQueryHandler = () => {
    $(document).on('submit', '.sql-form', function(event) {
        event.preventDefault();
        const query = $('#sql-query').val();

        axios.post('/custom-sql-query/run', { query })
            .then(response => {
                renderTable(response.data.columns, response.data.rows);
            })
            .catch(error => {
                console.error('Error running SQL query:', error);
                alert('An error occurred while running the SQL query.');
            });
    });

    const renderTable = (columns, rows) => {
        $('.sql-result-table').remove();

        const $table = $('<table>').addClass('sql-result-table stripes');
        const $thead = $('<thead>');
        const $headerRow = $('<tr>');

        columns.forEach(col => {
            $headerRow.append($('<th>').text(col));
        });
        $thead.append($headerRow);
        $table.append($thead);

        const $tbody = $('<tbody>');
        rows.forEach(row => {
            const $row = $('<tr>');
            columns.forEach(col => {
                $row.append($('<td>').text(row[col] || ''));
            });
            $tbody.append($row);
        });
        $table.append($tbody);

        $('.table-container').append($table);
    };
}
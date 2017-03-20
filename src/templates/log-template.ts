let asString = `<html>
    <head></head>
    <body>
        <% if (activities) { %>
            <table>
                <thead>
                    <tr>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Application</th>
                        <th>Window Title</th>
                        <th>Screenshots</th>
                    </tr>            
                </thead>
                <tbody>
                <% activities.forEach(function(activity){ %>
                    <tr>
                        <td><%= activity.startTime %></td>
                        <td><%= activity.endTime %></td>
                        <td><%= activity.appName %></td>
                        <td><%= activity.windowName %></td>
                        <td>
                            <% if(activity.screenshots && activity.screenshots.length > 0) { %>
                            <ul>
                                <% activity.screenshots.forEach(function(screenshot){ %>
                                    <li>
                                        <img src="<%= screenshot %>" width=200 height=200 />
                                    </li>
                                <% }); %>
                            </ul>
                            <% } %>
                        </td>
                    </tr>
                <% }); %>
                </tbody>
            </table>
        <% } else {%>
        <span>No activities to display</span>
        <% } %>
    </body>
</html>`;

export { asString };
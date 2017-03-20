let asString = `<html>
    <head>
        <title>Activity Monitor : Log</title>
        <link href="http://cdn.muicss.com/mui-0.9.12/css/mui.min.css" rel="stylesheet" type="text/css" />
        <script src="http://cdn.muicss.com/mui-0.9.12/js/mui.min.js"></script>
        <style>
            .mui-container{
                padding-top:35px;
            }
        </style>
    </head>
    <body>
        <div class="mui-container">
        <% if (activities) { 
            
            var groups = _.groupBy(activities, (activity) => { 
                return moment(activity.startTime).format("ddd, MMM Do");
            }); %>

            <% for (var key in groups) {
                if (groups.hasOwnProperty(key)) { 
                    var groupedActivities = groups[key];%>
        <div class="mui-panel">
            <div class="mui-appbar">
                <table width="100%">
                    <tr style="vertical-align:middle;">
                        <td class="mui--appbar-height"><%= key %></td>
                    </tr>
                </table>
            </div>
            <table class="mui-table mui-table--bordered">
                <thead>
                    <tr>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Application</th>
                        <th>Window Title</th>
                        <th>Screenshots</th>
                    </tr>            
                </thead>
                <tbody>
                <% groupedActivities.forEach((activity) => { %>
                    <tr>
                        <td><%= moment(activity.startTime).format("h:mm:ss a") %></td>
                        <td><%= moment(activity.endTime).format("h:mm:ss a") %></td>
                        <td><%= activity.appName %></td>
                        <td><%= activity.windowName %></td>
                        <td>
                            <% if(activity.screenshots && activity.screenshots.length > 0) { %>
                            <ul>
                                <% activity.screenshots.forEach((screenshot) => { %>
                                    <li>
                                        <a href="<%= screenshot %>"><img src="<%= screenshot %>" width="200" /></a>
                                    </li>
                                <% }); %>
                            </ul>
                            <% } %>
                        </td>
                    </tr>
                <% }); %>
                </tbody>
            </table>
            </div>
                <%}
            }%>

        <% } else {%>
        <span>No activities to display</span>
        <% } %>
        </div>
    </body>
</html>`;

export { asString };
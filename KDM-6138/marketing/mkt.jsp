<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%
  // 상품 구분: mkt.jsp?mode=1 → 암보험, mkt.jsp?mode=2 → 치아보험
  String mode = request.getParameter("mode");
  String pageTitle;
  if ("1".equals(mode)) {
    pageTitle = "암보험";
  } else if ("2".equals(mode)) {
    pageTitle = "치아보험";
  } else {
    response.sendError(HttpServletResponse.SC_NOT_FOUND);
    return;
  }
%>
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><%= pageTitle %></title>
</head>
<body>
  <%@ include file="includes/header.jsp" %>

  <main id="contents">
<% if ("1".equals(mode)) { %>
    <%@ include file="products/cancer001/contents.jsp" %>
<% } else { %>
    <%@ include file="products/dental001/contents.jsp" %>
<% } %>
  </main>

  <%@ include file="includes/footer.jsp" %>
<% if ("1".equals(mode)) { %>
  <script src="products/cancer001/js/cancer001.js"></script>
<% } %>
</body>
</html>
create view user_article as 
select 
u.id as u_id, 
b.id as b_id, 
a.id as a_id, 
a.title as a_title,
a.thumbnail as a_thumbnail,
a.summary as a_summary
from user as u, article as a, bookmark as b
where u.id = b.fk_user_id and b.fk_article_id = a.id;
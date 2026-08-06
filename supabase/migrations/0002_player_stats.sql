-- Vista para calcular automáticamente las estadísticas de los jugadores en base a los partidos jugados y los resultados.

create or replace view public.player_stats_view as
with player_match_outcomes as (
    select 
        mp.player_id,
        mp.match_id,
        case 
            when mp.team_id = mr.team_a_id and mr.team_a_score > mr.team_b_score then 'win'
            when mp.team_id = mr.team_b_id and mr.team_b_score > mr.team_a_score then 'win'
            when mr.team_a_score = mr.team_b_score then 'draw'
            else 'loss'
        end as outcome
    from public.match_players mp
    join public.matches m on m.id = mp.match_id
    join public.match_results mr on mr.match_id = mp.match_id
    where m.status = 'finalizado' and mp.team_id is not null
),
player_goals as (
    select 
        player_id,
        count(id) as total_goals
    from public.goals
    where is_own_goal = false
    group by player_id
)
select 
    p.id as player_id,
    p.first_name,
    p.last_name,
    p.nickname,
    count(pmo.match_id) as pj,
    count(pmo.match_id) filter (where pmo.outcome = 'win') as pg,
    count(pmo.match_id) filter (where pmo.outcome = 'draw') as pe,
    count(pmo.match_id) filter (where pmo.outcome = 'loss') as pp,
    coalesce(pg.total_goals, 0) as g,
    (count(pmo.match_id) filter (where pmo.outcome = 'win') * 3) + 
    (count(pmo.match_id) filter (where pmo.outcome = 'draw') * 1) as pts
from public.players p
left join player_match_outcomes pmo on pmo.player_id = p.id
left join player_goals pg on pg.player_id = p.id
group by p.id, p.first_name, p.last_name, p.nickname, pg.total_goals;

-- Grant access to the view
grant select on public.player_stats_view to authenticated;
grant select on public.player_stats_view to anon;

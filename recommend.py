import math

def get_sim(data, user1, user2):
    item_list = []
    for item in data[user1]:
        if item in data[user2]:
            item_list.append(item)

    if len(item_list)==0:
        return 0
    return 1 / (1 + sum([pow(data[user1][item] - data[user2][item], 2) for item in item_list]))

def recommend(user,num):
    totals = {}
    sum = {}

    list_other = list(data)
    list_other.remove(user)
    
    for other in list_other:
        set_user = set(data[user])
        set_other = set(data[other])
        set_newone = set_other.difference(set_user)

        score = get_sim(data,user,other)
        
        for item in set_newone:
            sum.setdefault(item,0)
            sum[item] += score
            
            totals.setdefault(item,0)
            totals[item] += score*data[other][item]

    ranking = [(total/sum[item],item) for item,total in totals.items()]
    ranking.sort()
    ranking.reverse()
    
    return [i[1] for i in ranking][:num]

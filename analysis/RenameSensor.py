
# coding: utf-8

# In[1]:


import pandas as pd


# In[2]:


pos=pd.read_csv('sensorpos.csv')


# In[28]:


def mark(f,x,y):
    if f==1:
        if 1<=y<=5:
            if 2<=x<=3:
                return 'PSA'
            if 4<=x<=5:
                return 'PSB'
            if 6<=x<=7:
                return 'PSC'
            if 8<=x<=9:
                return 'PSD'
        if 2<=y<=5:
            if 12<=x<=13:
                return 'CI'
        if 7<=y<=8:
            if 3<=x<=9:
                return 'POSTER'
        if 10<=y<=11:
            if x==1:
                return 'TOPLD1'
            if x==14:
                return 'BOTLD1'
            if 4<=x<=5:
                return 'WC1'
            if 6<=x<=9:
                return 'ROOM1'
            if 10<=x<=11:
                return 'ROOM2'
        if 15<=y<=18:
            if 2<=x<=11:
                return 'EXHIBITION'
        if 19<=y<=28:
            if 2<=x<=11:
                return 'MAIN'
            if 14<=x<=15:
                if 19<=y<=20:
                    return 'SERVE'
                if 21<=y<=24:
                    return 'ROOM3'
                if 25<=y<=26:
                    return 'ROOM4'
                if 27<=y<=28:
                    return 'WC2'
        if x==0 and y==19:
            return 'MAINEXIT'
        if x==13 and y==0:
            return 'CIENTRY1'
        if x==15:
            if y==2:
                return 'CIENTRY2'
            if y==4:
                return 'CIENTRY3'
            if y==5:
                return 'CIEXIT1'
            if y==7:
                return 'CIENTRY4'
            if y==15:
                return 'EXHEXIT1'
            if y==17:
                return 'EXHEXIT2'
        else:
            return 'AISLE1'
    elif f==2:
        if 10<=y<=11:
            if x==1:
                return 'TOPLD1'
            if x==14:
                return 'BOTLD1'
            if 4<=x<=5:
                return 'WC3'
            if 6<=x<=7:
                return 'ROOM6'
        if 1<=y<=5:
            if 2<=x<=9:
                return 'CANTEEN'
            if 10<=x<=11:
                return 'ROOM5'
        if 0<=y<=5:
            if 13<=x<=15:
                return 'ENTERTAIN'
        else:
            return 'AISLE2'


# In[29]:


pos['NAME']=pos.apply(lambda row: mark(row['floor'], row['x'],row['y']), axis=1)


# In[31]:


pos.to_csv('sensorpos_withfunction.csv',index=False)


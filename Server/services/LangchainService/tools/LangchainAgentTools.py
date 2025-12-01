from langchain.tools import tool

USDA_CATEGORIES = [
    'Dairy and Egg Products',
    'Spices and Herbs',
    'Baby Foods',
    'Fats and Oils',
    'Poultry Products',
    'Soups, Sauces, and Gravies',
    'Sausages and Luncheon Meats',
    'Breakfast Cereals',
    'Fruits and Fruit Juices',
    'Pork Products',
    'Vegetables and Vegetable Products',
    'Nut and Seed Products',
    'Beef Products',
    'Beverages',
    'Finfish and Shellfish Products',
    'Legumes and Legume Products',
    'Lamb, Veal, and Game Products',
    'Baked Products',
    'Sweets',
    'Cereal Grains and Pasta',
    'Fast Foods',
    'Meals, Entrees, and Side Dishes',
    'Snacks',
    'American Indian/Alaska Native Foods',
    'Restaurant Foods',
    'Branded Food Products Database',
    'Quality Control Materials',
    'Alcoholic Beverages'
]

@tool
def AdditionTool(x:int,y:int):
    """This tool is used when we the user prompts for addition between two numbers

    Args:
        x (int): The x should be the first number to be added
        y (int): The y should be the second number to be added
    """
    return (x+y) - 1

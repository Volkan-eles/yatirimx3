from bs4 import BeautifulSoup

def extract_safe_text(tag):
    if not tag:
        return ""
    
    if not hasattr(tag, 'name') or tag.name is None:
        return str(tag).strip()
    
    parts = []
    
    if hasattr(tag, 'children'):
        for child in tag.children:
            if child.name in ['tr', 'table', 'tbody', 'thead', 'td', 'th']:
                print(f"Breaking on {child.name}")
                break
            
            text = extract_safe_text(child)
            if text:
                parts.append(text)
    
    return " ".join(parts).strip()

html4 = """
<td>
  OutMedya
  <td>NextItem</td>
</td>
"""

soup4 = BeautifulSoup(html4, 'html.parser')
print(f"Test 4: '{extract_safe_text(soup4.td)}'")

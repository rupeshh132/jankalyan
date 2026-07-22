import csv
with open(r'C:\Users\rupesh vishwakarma\OneDrive\Desktop\jankalyan\target\site\jacoco\jacoco.csv', 'r') as f:
    reader = csv.DictReader(f)
    classes = list(reader)
    
    total_inst_missed = sum(int(c['INSTRUCTION_MISSED']) for c in classes)
    total_inst_covered = sum(int(c['INSTRUCTION_COVERED']) for c in classes)
    total_branch_missed = sum(int(c['BRANCH_MISSED']) for c in classes)
    total_branch_covered = sum(int(c['BRANCH_COVERED']) for c in classes)
    
    overall_inst = (total_inst_covered / (total_inst_covered + total_inst_missed)) * 100
    overall_branch = (total_branch_covered / max(1, total_branch_covered + total_branch_missed)) * 100
    
    print(f'Overall instruction coverage: {overall_inst:.2f}%')
    print(f'Overall branch coverage: {overall_branch:.2f}%')
    print('Top 10 classes with lowest coverage:')
    
    def get_cov(c):
        t = int(c['INSTRUCTION_COVERED']) + int(c['INSTRUCTION_MISSED'])
        return int(c['INSTRUCTION_COVERED']) / t if t > 0 else 0
        
    classes.sort(key=get_cov)
    for c in classes[:10]:
        print(f"{c['PACKAGE']}.{c['CLASS']}: {get_cov(c)*100:.2f}%")

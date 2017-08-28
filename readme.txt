Welcome to MyApp
3	0		Banner	75,1,a,b	Label		E		DGiT
3	0		Banner	1,1,a,b	Image		E		SF  Logo
3	0		Banner	50,2,a,b	Label		E		<DYNAMIC_UI_FUN:setGreetings()>,
3	0		Banner	60,1,a,b	Label	user	E		<SQL:SELECT EMPL_NAME FROM DDFHD0D.R20784U.LP114 WHERE SIGNONID = ?[alias] WITH UR;>
3	0		Banner	65,1,a,b	Image	home	E		homeMin.png
3	0		Banner	70,1,a,b	Image	logout	E		logoutMin.png
3	0			COMP_PER_ROW=1	Panel	PANEL_01	D		
3	0		PANEL_01	COMP_ORDER=1	ENV_LINK	StateCd	E	Selected Environment :	<DYNAMIC_FUN:selectedEnvDetails()>
3	0			COMP_PER_ROW=2	Panel	PANEL_02	D		
3	0		PANEL_02	COMP_PER_ROW=1	Panel	PANEL_03	D		
3	0	1	PANEL_03	COMP_ORDER=1	Menu	Menu_1	E	Fabricate	
3	0	2	PANEL_03	COMP_ORDER=2	Menu	Menu_2	E	Review Data	
3	0			COMP_PER_ROW=2	Panel	PANEL_04	E	DGiT-Health Review Data	
3	0		PANEL_04	COMP_PER_ROW=5	Panel	PANEL_05	E		
3	0		PANEL_05	COMP_ORDER=1	Drop_Down	USER	E	User *	<DYNAMIC_FUN:userDetails()>
3	0		PANEL_05	COMP_ORDER=2	Label	OR	E	(or)	
3	0		PANEL_05	COMP_ORDER=3	Text_Box	N_F_PLC	E	Policy Number *	
3	0		PANEL_05	COMP_ORDER=4	Label	OR	E	(or)	
3	0		PANEL_05	COMP_ORDER=5	Text_Box	PROJ_NO	E	Project#	
3	0		PANEL_04	COMP_PER_ROW=3	Panel	PANEL_06	E		
3	0		PANEL_06	COMP_ORDER=1	Drop_Down	TYPE_OF_PROD	E	Type of Product(Optional)	<DYNAMIC_FUN:listOutProducts()>
3	0		PANEL_06	COMP_ORDER=2	Dgit_Empty_Comp		E		
3	0		PANEL_06	COMP_ORDER=3	Date_Picker	EFF_DATE	E	Effective Date*	
3	0		PANEL_04	COMP_ORDER=6	Button	review_review_btn	E	Review	
3	0		PANEL_04	COMP_ORDER=7	Button	review_reset_btn	E	Reset	

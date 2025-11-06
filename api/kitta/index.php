<?php
if (!headers_sent()) {
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "db_kitta.php";

// -----------------------------
// Parse the request
// -----------------------------
$basePath = "/api/kitta"; 
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = preg_replace("#^$basePath#", "", $path);
$path = rtrim($path, "/");
$path = ltrim(strtolower($path), "/");  
$pathParts = $path === "" ? [] : explode("/", $path);
$method = $_SERVER['REQUEST_METHOD'];

// -----------------------------
// Routing
// -----------------------------
if ($method === "GET") {
    switch ($pathParts[0] ?? "") {
        case "":
            apiHelp();
            break;
        case "getgabisas":
            getGabisasHandler();
            break;
        case "getwards":
            getWardsHandler($pathParts[1] ?? null);
            break;
        case "getdetailsbykittano":
            getDetailsByKittaNoHandler($pathParts[1] ?? null,$pathParts[2] ?? null,$pathParts[3] ?? null);
            break;
        case "getdetailsbyowner":
             getDetailsByOwnerHandler($pathParts[1] ?? null,$pathParts[2] ?? null,$pathParts[3] ?? null,$pathParts[4] ?? null);      
             break;
        default:
            notFound();
    }
} elseif ($method === "POST") {
    switch ($pathParts[0] ?? "") {
        case "login":
            loginHandler();
            break;
        case "createmaster":
            createMasterHandler();
            break;
        case "saverecords":
            saveRecordsHandler();
            break;                                
        default:
            methodNotAllowed();
    }
} else {
    methodNotAllowed();
}

// -----------------------------
// Handlers
// -----------------------------
function loginHandler() {
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");    
// Read raw JSON input from frontend
    $input = json_decode(file_get_contents("php://input"), true);
// Read username & password from POST
   
$username = $input['username'] ?? $_POST['username'] ?? '';
$password = $input['password'] ?? $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        echo json_encode([
            "status" => false,
            "message" => "Username र Password आवश्यक छ"
        ], JSON_UNESCAPED_UNICODE);
        return;
    }

    try {
        // Fetch user by username
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username LIMIT 1");
        $stmt->execute([':username' => $username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            echo json_encode([
                "status" => false,
                "message" => "प्रयोगकर्ता वा पासवर्ड मिलेन !"
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Verify password
        if (!password_verify($password, $user['password'])) {
            echo json_encode([
                "status" => false,
                "message" => "गप्रयोगकर्ता वा पासवर्ड मिलेन !"
            ], JSON_UNESCAPED_UNICODE);
            return;
        }

        // Successful login
        echo json_encode([
            "status" => true,
            "message" => "लगइन सफल भयो",
            "data" => [
                "id" => $user['id'],
                "username" => $user['username']
            ]
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        respondDbError($e);
    }
}


function createMasterHandler() {
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");
    header('Content-Type: application/json; charset=utf-8');
    try {
        // Start transaction
        $pdo->beginTransaction();
        // Truncate existing data
        $pdo->exec("DELETE FROM land_master");
        // Insert fresh data
        $insertQuery = "
            INSERT INTO land_master (municipalityvdcid, landmunicipalityvdc, wardno)
            SELECT DISTINCT municipalityvdcid, landmunicipalityvdc, wardno
            FROM lands
            ORDER BY landmunicipalityvdc, wardno
        ";
        $pdo->exec($insertQuery);
        // Commit changes
        $pdo->commit();
        echo json_encode([
            "status" => true,
            "message" => "Master table सफलतापूर्वक अपडेट भयो।"
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        // Safe rollback without crashing if no transaction is active
        try {
            $pdo->rollBack();
        } catch (Exception $rollbackError) {
            // Silently fail rollback if not active
        }
        respondDbError($e);
    }
}

function saveRecordsHandler() {
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");
    header('Content-Type: application/json; charset=utf-8');

    try {
        // Read and decode JSON input
        $json = file_get_contents('php://input');
        $records = json_decode($json, true);

        if (!is_array($records) || count($records) === 0) {
            echo json_encode(["status" => false, "message" => "No valid records received."]);
            return;
        }

        // Get municipalityvdcid from first record
        $municipalityvdcid = $records[0]['municipalityvdcid'] ?? null;
        if (!$municipalityvdcid) {
            echo json_encode(["status" => false, "message" => "municipalityvdcid not found in first record."]);
            return;
        }

        // Start transaction
        $pdo->beginTransaction();

        // Delete existing data for that municipalityvdcid
        $deleteStmt = $pdo->prepare("DELETE FROM lands WHERE municipalityvdcid = :municipalityvdcid");
        $deleteStmt->execute([':municipalityvdcid' => $municipalityvdcid]);

        // Prepare insert query
        $stmt = $pdo->prepare("
            INSERT INTO lands (
                presentparcleno,
                districtid,
                wardno,
                area,
                citizenship_no,
                classtype_np,
                fatherhusbandname,
                grandfatherdname,
                idissuedate,
                idsuingOffice,
                iud,
                landdistrict,
                landmunicipalityvdc,
                landtype_np,
                landusetype_np,
                lin,
                mapnumber,
                mothno,
                municipalityvdcid,
                owner_name,
                owneraddress,
                ownershiptype_np,
                pageno,
                partno,
                placeOfIssue,
                tenantneplainame
            ) VALUES (
                :presentparcleno,
                :districtid,
                :wardno,
                :area,
                :citizenship_no,
                :classtype_np,
                :fatherhusbandname,
                :grandfatherdname,
                :idissuedate,
                :idsuingOffice,
                :iud,
                :landdistrict,
                :landmunicipalityvdc,
                :landtype_np,
                :landusetype_np,
                :lin,
                :mapnumber,
                :mothno,
                :municipalityvdcid,
                :owner_name,
                :owneraddress,
                :ownershiptype_np,
                :pageno,
                :partno,
                :placeOfIssue,
                :tenantneplainame
            )
        ");

        // Split into chunks of 100
        $chunks = array_chunk($records, 100);
        $totalInserted = 0;

        foreach ($chunks as $chunk) {
            foreach ($chunk as $record) {
                $stmt->execute([
                    ':presentparcleno'    => $record['presentparcleno'] ?? null,
                    ':districtid'         => $record['districtid'] ?? null,
                    ':wardno'             => $record['wardno'] ?? null,
                    ':area'               => $record['area'] ?? null,
                    ':citizenship_no'     => $record['citizenship_no'] ?? null,
                    ':classtype_np'       => $record['classtype_np'] ?? null,
                    ':fatherhusbandname'  => $record['fatherhusbandname'] ?? null,
                    ':grandfatherdname'   => $record['grandfatherdname'] ?? null,
                    ':idissuedate'        => $record['idissuedate'] ?? null,
                    ':idsuingOffice'      => $record['idsuingOffice'] ?? null,
                    ':iud'                => $record['iud'] ?? null,
                    ':landdistrict'       => $record['landdistrict'] ?? null,
                    ':landmunicipalityvdc'=> $record['landmunicipalityvdc'] ?? null,
                    ':landtype_np'        => $record['landtype_np'] ?? null,
                    ':landusetype_np'     => $record['landusetype_np'] ?? null,
                    ':lin'                => $record['lin'] ?? null,
                    ':mapnumber'          => $record['mapnumber'] ?? null,
                    ':mothno'             => $record['mothno'] ?? null,
                    ':municipalityvdcid'  => $record['municipalityvdcid'] ?? null,
                    ':owner_name'         => $record['owner_name'] ?? null,
                    ':owneraddress'       => $record['owneraddress'] ?? null,
                    ':ownershiptype_np'   => $record['ownershiptype_np'] ?? null,
                    ':pageno'             => $record['pageno'] ?? null,
                    ':partno'             => $record['partno'] ?? null,
                    ':placeOfIssue'       => $record['placeOfIssue'] ?? null,
                    ':tenantneplainame'   => $record['tenantneplainame'] ?? null,
                ]);
                $totalInserted++;
            }
        }

        // Commit transaction
        $pdo->commit();

        echo json_encode([
            "status" => true,
            "message" => "नगरपालिका {$municipalityvdcid} का {$totalInserted} रेकर्ड सफलतापूर्वक सुरक्षित गरियो।"
        ], JSON_UNESCAPED_UNICODE);

    } catch (PDOException $e) {
        try { $pdo->rollBack(); } catch (Exception $ignore) {}
        respondDbError($e);
    }
}


function getGabisasHandler() {
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");
    
    try {
        $stmt = $pdo->query("select distinct municipalityvdcid,landmunicipalityvdc from land_master order by landmunicipalityvdc");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);       

        echo json_encode([
            "status" => true,
            "message" => "डाटा प्राप्त भयो",
            "data" => $results           
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        respondDbError($e);
    }
}

function getWardsHandler($gabisa_id) {    
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");
    try {
        $stmt = $pdo->prepare("select distinct wardno from land_master where municipalityvdcid=? order by wardno");
        $stmt->execute([$gabisa_id]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status"=>true,"message"=>"डाटा प्राप्त भयो","data"=>$results], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        respondDbError($e);
    }
}

function getDetailsByOwnerHandler($citizenship_no,$year,$month,$day){
    // echo json_encode(["data":$citizenship_no,$year,$month,$day])
    $pdo=getPDO();
    if (!$pdo) return dbUnavailable("Remote");
    $eng = ['0','1','2','3','4','5','6','7','8','9'];
    $nep = ['०','१','२','३','४','५','६','७','८','९'];
    $nepcitizenship_no = str_replace($eng, $nep, $citizenship_no);
    $idissuedate=$year."/".$month."/".$day;
    try {
        $stmt = $pdo->prepare("select distinct citizenship_no,idissuedate,owner_name,fatherhusbandname,grandfatherdname,owneraddress from lands where citizenship_no=? and idissuedate=?");
        $stmt->execute([$nepcitizenship_no, $idissuedate]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);   
        $stmt1 = $pdo->prepare("select distinct landmunicipalityvdc,wardno,presentparcleno,landtype_np,classtype_np,landusetype_np,area,mothno,pageno from lands where citizenship_no=? and idissuedate=?");
        $stmt1->execute([$nepcitizenship_no, $idissuedate]);
        $results1 = $stmt1->fetchAll(PDO::FETCH_ASSOC); 
        echo json_encode([
            "status"=>true,
            "message"=>"डाटा प्राप्त भयो",
            "data"=>$results,
            "data1"=>$results1         
        ], JSON_UNESCAPED_UNICODE);
       
    } catch (PDOException $e) {
         respondDbError($e);
    }
}




function getDetailsByKittaNoHandler($gabisa_id, $ward_no, $kitta_no) {
    $pdo = getPDO();
    if (!$pdo) return dbUnavailable("Remote");
    if (!$gabisa_id || !$ward_no || !$kitta_no) return invalidInput("All required parameters");
    $eng = ['0','1','2','3','4','5','6','7','8','9'];
    $nep = ['०','१','२','३','४','५','६','७','८','९'];
    $converted = str_replace($eng, $nep, $kitta_no);
    try {
        $stmt = $pdo->prepare("select distinct citizenship_no,idissuedate,owner_name,fatherhusbandname,grandfatherdname,owneraddress from lands where municipalityvdcid=? and wardno=? and presentparcleno=?");
        $stmt->execute([$gabisa_id, $ward_no, $converted]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);   
        $stmt1 = $pdo->prepare("select distinct landmunicipalityvdc,wardno,presentparcleno,landtype_np,classtype_np,landusetype_np,area,mothno,pageno from lands where municipalityvdcid=? and wardno=? and presentparcleno=?");
        $stmt1->execute([$gabisa_id, $ward_no, $converted]);
        $results1 = $stmt1->fetchAll(PDO::FETCH_ASSOC); 
        echo json_encode([
            "status"=>true,
            "message"=>"डाटा प्राप्त भयो",
            "data"=>$results,
            "data1"=>$results1         
        ], JSON_UNESCAPED_UNICODE);
    } catch (PDOException $e) {
        respondDbError($e);
    }
}



// -----------------------------
// Helper Responses
// -----------------------------
function apiHelp() {
    http_response_code(200);
    echo json_encode([
        "status" => true,
        "message" => "Available API endpoints",
        "routes" => [
            "/api/kitta/getgabisas" => "सबै गा.वि.सहरुको सूची",
            "/api/kitta/getwards/{gabisa_id}" => "वडाहरुको सुची गा.वि.स अनुसार",            
            "/api/kitta/getdetailsbykittano/{gabisa_id}/{ward_no}/{kitta_no}" => "कित्ता विवरण"
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

function notFound() { http_response_code(404); echo json_encode(["status"=>false,"message"=>"Not Found"]); exit(); }
function methodNotAllowed() { http_response_code(405); echo json_encode(["status"=>false,"message"=>"Method Not Allowed"]); exit(); }
function respondDbError($e) { http_response_code(500); echo json_encode(["status"=>false,"message"=>"Database Error","error"=>$e->getMessage()]); exit(); }
function dbUnavailable($type) { http_response_code(500); echo json_encode(["status"=>false,"message"=>"$type database not available"]); exit(); }
function invalidInput($field) { http_response_code(400); echo json_encode(["status"=>false,"message"=>"Invalid input: $field"]); exit(); }
?>

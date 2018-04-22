<?php

namespace app\models;

use Yii;

/**
 * This is the model class for table "graphs".
 *
 * @property int $id
 * @property string $name
 *
 * @property Vertices[] $vertices
 */
class Graphs extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'graphs';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['name'], 'required'],
            [['name'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'name' => 'Name',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getVertices()
    {
        return $this->hasMany(Vertices::className(), ['graph_id' => 'id']);
    }
}
